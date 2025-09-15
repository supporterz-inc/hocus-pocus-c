import { raw } from 'hono/html';
import { marked } from 'marked';
import type { Knowledge } from '../models/knowledge.model.js';
import { Button } from './Button.js';
import { Layout } from './Layout.js';

interface KnowledgeDetailFeatureProps {
  knowledge: Knowledge;
  userId: string; // userId を props で受け取る
}

export function KnowledgeDetailFeature({ knowledge, userId }: KnowledgeDetailFeatureProps) {
  const html = marked(knowledge.content);
  const isAuthor = knowledge.authorId === userId;

  return (
    <Layout title={knowledge.title}>
      <article className="prose lg:prose-xl [&_*]:my-2">
        <h1 className="text-center">{knowledge.title}</h1>
        <div>{raw(html)}</div>
      </article>
      {isAuthor && (
        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-underline"
          href={`/knowledges/${knowledge.knowledgeId}/edit`}
        >
          編集する
        </a>
      )}
      <Button path="/" text="一覧に戻る" />
    </Layout>
  );
}
