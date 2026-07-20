import { KnowledgeRepository } from '../models/knowledge.repository.js';

/**
 * 編集画面のHTMLを生成するコントローラー
 * @param userId ログイン中のユーザーID
 * @param knowledgeId 編集対象のナレッジID
 */
export async function editKnowledgePageController(userId: string, knowledgeId: string): Promise<string> {
  // 1. 既存のデータを取得する
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  if (!knowledge) {
    throw new Error('指定されたナレッジが見つかりません。');
  }

  // 2. 認可チェック：自分が投稿したナレッジか確認する
  if (knowledge.authorId !== userId) {
    throw new Error('このナレッジを編集する権限がありません。');
  }

  // 3. 本文データをフォームの初期値に入れてHTML（文字列）を返す
  // ※ ここは既存の一覧画面などの実装（JSXやテンプレート）に合わせて適宜調整してください
  return (
    <div>
      <h1>ナレッジの編集</h1>
      <form action={`/knowledges/${knowledge.knowledgeId}/edit`} method="post">
        <div>
          <label htmlFor="content">本文 (Markdown)</label>
          <textarea
            id="content"
            name="content"
            rows={10}
            style={{ width: '100%', display: 'block', marginBottom: '10px' }}
          >
            {knowledge.content}
          </textarea>
        </div>
        <button type="submit">更新する</button>
      </form>
      <a href="/">キャンセル</a>
    </div>
  ); // プロジェクトがJSXを文字列に変換する設定（Honoのhtmlなど）になっていればこれで動きます
}
