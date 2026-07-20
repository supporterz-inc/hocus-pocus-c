import { Hono } from 'hono';
import { createKnowledgeController } from './controllers/create-knowledge.controller.js';
import { editKnowledgePageController } from './controllers/edit-knowledge-page.controller.js';
import { getAllKnowledgesController } from './controllers/get-all-knowledges.controller.js';
import { updateKnowledgeController } from './controllers/update-knowledge.controller.js';
import { Knowledge } from './models/knowledge.model.js';
import { KnowledgeRepository } from './models/knowledge.repository.js';

export interface Variables {
  userId: string;
}

export const router = new Hono<{ Variables: Variables }>();

router.get('/', (ctx) => {
  // biome-ignore lint/suspicious/noExplicitAny: Context type not fully defined
  const userId = (ctx as any).get('userId') as string | undefined;
  return ctx.html(getAllKnowledgesController(userId ?? 'anonymous'));
});

router.get('/create', (ctx) => {
  // ステップ 1: Context から userId を取得
  // biome-ignore lint/suspicious/noExplicitAny: Context type not fully defined
  const userId = (ctx as any).get('userId') as string | undefined;

  // ステップ 2: userId が undefined の場合は 'anonymous' を使う
  // ステップ 3: createKnowledgeController にユーザー ID を渡して、HTML を返す
  return ctx.html(createKnowledgeController(userId ?? 'anonymous'));
});

router.post('/knowledges', async (ctx) => {
  // ========================================
  // ステップ 1: ユーザー ID を取得
  // ========================================
  // biome-ignore lint/suspicious/noExplicitAny: Context type not fully defined
  const userId = ((ctx as any).get('userId') as string) ?? 'anonymous';

  // ========================================
  // ステップ 2: リクエスト body を JSON パースして取得
  // ========================================
  const body = (await ctx.req.json()) as { content?: unknown };

  // ========================================
  // ステップ 3: body から content を取得し、型チェック
  // ========================================
  const content = typeof body.content === 'string' ? body.content : '';

  // ========================================
  // ステップ 4: バリデーション — content が空でないか確認
  // ========================================
  if (!content.trim()) {
    return ctx.text('Content is required', 400);
  }

  // ========================================
  // ステップ 5: ドメインモデル Knowledge を生成
  // ========================================
  const knowledge = Knowledge.create(content, userId);

  // ========================================
  // ステップ 6: Knowledge をリポジトリに保存（ファイル書き込み）
  // ========================================
  await KnowledgeRepository.upsert(knowledge);

  // ========================================
  // ステップ 7: 作成完了後、一覧ページへリダイレクト
  // ========================================
  return ctx.redirect('/');
});

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
