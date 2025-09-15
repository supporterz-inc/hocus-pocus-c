import { randomUUID } from 'node:crypto';

/**
 * ナレッジのドメインモデル
 */
export interface Knowledge {
  readonly __tag: 'Knowledge';

  /**
   * ナレッジの一意な ID
   *
   * @todo (学生向け，発展課題) Nominal Type を使って型安全にする
   */
  readonly knowledgeId: string;

  /**
   * ナレッジの作成者の ID
   *
   * @todo (学生向け，発展課題) Nominal Type を使って型安全にする
   */
  readonly authorId: string;

  /**
   * ナレッジのタイトル
   *
   * @todo (学生向け) 空白の場合は不正な Knowledge とみなす
   */
  readonly title: string;

  /**
   * ナレッジの本文 (Markdown)
   *
   * @todo (学生向け) 空白の場合は不正な Knowledge とみなす
   */
  readonly content: string;

  /**
   * ナレッジの作成日時 (UNIX タイムスタンプ)
   */
  readonly createdAt: number;

  /**
   * ナレッジの更新日時 (UNIX タイムスタンプ)
   */
  readonly updatedAt: number;
}

/**
 * ナレッジを新規作成する
 *
 * @param content ナレッジの本文
 * @param authorId ナレッジの作成者の ID
 * @returns 新規作成されたナレッジ
 * @param title ナレッジのタイトル
 */
function create(content: Knowledge['content'], authorId: Knowledge['authorId'], title: Knowledge['title']): Knowledge {
  const now = Math.floor(Date.now() / 1000);

  return {
    __tag: 'Knowledge',
    knowledgeId: randomUUID(),
    content,
    authorId,
    createdAt: now,
    updatedAt: now,
    title,
  };
}

/**
 * ナレッジを更新する
 *
 * @param knowledge 更新対象のナレッジ
 * @param content 新しいナレッジの本文
 * @returns 更新されたナレッジ
 * @param title 新しいナレッジのタイトル
 */
function update(self: Knowledge, content: Knowledge['content'], title: Knowledge['title']): Knowledge {
  return {
    ...self,
    content,
    updatedAt: Math.floor(Date.now() / 1000),
    title,
  };
}

export const Knowledge = {
  create,
  update,
};
