import { Hono } from 'hono';
import { deleteKnowledgeController } from './controllers/delete-knowledge.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getEditKnowledgeController } from './controllers/get-edit-knowledge.controller.js';
import { getKnowledgeByIdController } from './controllers/get-knowledge-by-id.controller.js';
import { getNewKnowledgeController } from './controllers/get-new-knowledge.controller.js';
import { patchKnowledgeController } from './controllers/patch-knowledge.controller.js';
import { postKnowledgeController } from './controllers/post-knowledge.controller.js';

export interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  // MEMO: `ctx.get('userId')` によって、必要に応じて UserID を利用できる
  const userId = ctx.get('userId');
  console.log('Signed-in :', userId);

  // MEMO: Controller は Context を直接受け取らず、必要な情報のみを引数に受け取る
  return ctx.html(getAllKnowledgesController(userId));
});

router.get('/knowledges/new', (ctx) => {
  return ctx.html(getNewKnowledgeController());
});

router.post('/knowledges', async (ctx) => {
  const userId = ctx.get('userId');
  const form = await ctx.req.formData();

  await postKnowledgeController({
    userId,
    content: form.get('content') as string,
    title: form.get('title') as string,
  });

  return ctx.redirect('/');
});

router.get('/knowledges/:knowledgeId', async (ctx) => {
  const userId = ctx.get('userId');
  const { knowledgeId } = ctx.req.param();

  return ctx.html(await getKnowledgeByIdController(userId, knowledgeId));
});

router.get('/knowledges/:knowledgeId/edit', async (ctx) => {
  const userId = ctx.get('userId');
  const { knowledgeId } = ctx.req.param();

  return ctx.html(await getEditKnowledgeController(userId, knowledgeId));
});

router.post('/knowledges/:knowledgeId', async (ctx) => {
  const userId = ctx.get('userId');
  const { knowledgeId } = ctx.req.param();
  const form = await ctx.req.formData();

  await patchKnowledgeController({
    userId,
    knowledgeId,
    title: form.get('title') as string,
    content: form.get('content') as string,
  });

  return ctx.redirect(`/knowledges/${knowledgeId}`);
});

router.post('/knowledges/:knowledgeId/delete', async (ctx) => {
  const userId = ctx.get('userId');
  const { knowledgeId } = ctx.req.param(); //URLから文字列を取ってくる

  await deleteKnowledgeController(userId, knowledgeId);

  return ctx.redirect('/');
});
