import { Hono } from 'hono';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { getKnowledgeController } from './controllers/get-knowledge.controller.js';

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

// 既存の router.get('/', ...) の下に追加します
// 1. 新しい記事を「投稿（POST）」するための受付窓口
// 💡 末尾にスラッシュをつけて '/knowledges/' にするか、または一旦コメントアウトするかですが、
// ルーターの競合を防ぐために、以下のように綺麗に整えます。

router.post('/knowledges/', async (ctx) => {
  const body = await ctx.req.parseBody();
  console.log('送られてきたデータ:', body);
  return ctx.redirect('/');
});

// 2. 詳細画面を表示する窓口
// 💡 こちらもパスが正しく認識されるよう、以下のように書いてみてください。
router.get('/knowledges/:knowledgeId', async (ctx) => {
  const knowledgeId = ctx.req.param('knowledgeId');
  const component = await getKnowledgeController(knowledgeId);
  return ctx.html(component as never);
});
