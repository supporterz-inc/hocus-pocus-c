import { KnowledgeRepository } from '../models/knowledge.repository.js';
import type { Knowledge } from '../models/knowledge.model.js';

interface UpdateInput {
  title: string;
  content: string;
}

/**
 * ナレッジを更新するコントローラー
 * @param userId ログイン中のユーザーID
 * @param knowledgeId 更新対象のナレッジID
 * @param input フォームから送られてきた新しいタイトルと本文
 */
export async function updateKnowledgeController(
  userId: string,
  knowledgeId: string,
  input: UpdateInput
): Promise<void> {
  // 1. 他の子が作ってくれた getByKnowledgeId を使って、今のデータを取得する
  const currentKnowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  if (!currentKnowledge) {
    throw new Error('指定されたナレッジが見つかりません。');
  }

  // 2. 認可チェック：自分が投稿したナレッジか確認する
  // ※ knowledge.model.ts の定義に合わせて、必要なら authorId などのプロパティ名に調整してください
  if (currentKnowledge.authorId !== userId) {
    throw new Error('このナレッジを編集する権限がありません。');
  }

  // 3. データを上書きして upsert を呼ぶ
  const updatedKnowledge: Knowledge = {
    ...currentKnowledge,
    title: input.title,
    content: input.content,
    // updatedAt: new Date().toISOString() // もし更新日時の項目があれば入れる
  };

  await KnowledgeRepository.upsert(updatedKnowledge);
}