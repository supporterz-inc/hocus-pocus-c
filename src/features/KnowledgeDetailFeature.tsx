import { raw } from 'hono/html';
import { marked } from 'marked';
import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface KnowledgeDetailFeatureProps {
  knowledge: Knowledge;
  userId: string; // userId を props で受け取る
}

export function KnowledgeDetailFeature({ knowledge, userId }: KnowledgeDetailFeatureProps) {
  const html = marked(knowledge.content);
  const isAuthor = knowledge.authorId === userId;

  return (
    <Layout title="ナレッジ詳細表示">
      <article className="prose lg:prose-xl">
        {isAuthor && (
          <a className="button-primary" href={`/knowledges/${knowledge.knowledgeId}/edit`}>
            編集する
          </a>
        )}
        <pre>{raw(html)}</pre>
      </article>
    </Layout>
  );
}
