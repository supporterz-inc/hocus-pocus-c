import type { PropsWithChildren } from 'hono/jsx';

interface Props {
  title: string;
}

export function Layout({ title, children }: PropsWithChildren<Props>) {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Hocus Pocus - {title} | Knowledge Sharing Platform for GEEK-Project</title>
        <link href="/index.css" rel="stylesheet" />
      </head>

      <body>
        <div class="w-[375px] mx-auto">{children}</div>
      </body>
    </html>
  );
}
