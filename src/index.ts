import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { router, type Variables } from './router.js';

const app = new Hono<{ Variables: Variables }>();

const useDebugUser = process.argv[2];
const iapIssuer = 'https://supporterz-inc.cloudflareaccess.com';
const iapAudience = process.env['IAP_AUDIENCE']!;
const jwks = createRemoteJWKSet(new URL(`${iapIssuer}/cdn-cgi/access/certs`));
const port = parseInt(process.env['PORT'] ?? '8080');

app.use('/index.css', serveStatic({ path: 'target/index.css' }));
app.use(trimTrailingSlash());
app.use('*', async (ctx, next) => {
  const iapJwt = ctx.req.header('Cf-Access-Jwt-Assertion')!;

  if (useDebugUser == null) {
    try {
      const { payload } = await jwtVerify(iapJwt, jwks, {
        issuer: iapIssuer,
        audience: iapAudience,
      });

      ctx.set('userId', payload.sub!);
    } catch {
      throw new HTTPException(401, { message: 'IAP-JWT is Unauthorized :(' });
    }
  } else {
    ctx.set('userId', useDebugUser);
  }

  await next();
});

app.route('/', router);

const server = serve({
  fetch: app.fetch,
  port,
});

function handleShutdown() {
  server.close(() => process.exit(0));

  setTimeout(() => {
    console.error('The process did not exit gracefully after 1,000 milli-seconds. Exiting forcefully X(');
    process.exit(1);
  }, 1000);
}

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
