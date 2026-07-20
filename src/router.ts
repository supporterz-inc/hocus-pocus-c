import { Hono } from 'hono';
import { editKnowledgePageController } from './controllers/edit-knowledge-page.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getKnowledgeController } from './controllers/get-knowledge.controller.js';
import { updateKnowledgeController } from './controllers/update-knowledge.controller.js';

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

// 1. 新しい記事を「投稿（POST）」するための受付窓口
router.post('/knowledges/', async (ctx) => {
  const body = await ctx.req.parseBody();
  console.log('送られてきたデータ:', body);
  return ctx.redirect('/');
});

// 2. 詳細画面を表示する窓口
router.get('/knowledges/:knowledgeId', async (ctx) => {
  const knowledgeId = ctx.req.param('knowledgeId');
  const component = await getKnowledgeController(knowledgeId);
  return ctx.html(component as never);
});

// 3. 編集画面を表示する窓口
router.get('/knowledges/:id/edit', async (ctx) => {
  const userId = ctx.get('userId');
  const knowledgeId = ctx.req.param('id');

  try {
    const html = await editKnowledgePageController(userId, knowledgeId);
    return ctx.html(html);
  } catch (error) {
    ctx.status(404);
    return ctx.html(`<h1>エラー</h1><p>${(error as Error).message}</p>`);
  }
});

// 4. 更新処理を受け付ける窓口
router.post('/knowledges/:id/edit', async (ctx) => {
  const userId = ctx.get('userId');
  const knowledgeId = ctx.req.param('id');

  // フォームから送信されたデータ（title, content）を受け取る
  const body = await ctx.req.parseBody();
  const title = String(body['title']);
  const content = String(body['content']);

  try {
    // 作成した Controller を呼び出す
    await updateKnowledgeController(userId, knowledgeId, { title, content });

    // 更新が成功したら、トップページ（一覧）か詳細ページにリダイレクトする
    return ctx.redirect('/');
  } catch (error) {
    // もし他人の記事だったりしてエラーが出た場合のハンドリング
    ctx.status(403);
    return ctx.html(`<h1>エラー</h1><p>${(error as Error).message}</p>`);
  }
});