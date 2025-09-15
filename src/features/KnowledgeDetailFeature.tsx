import { raw } from 'hono/html';
import { marked } from 'marked';
import type { Knowledge } from '../models/knowledge.model.js';
import { Button } from './Button.js';
import { Layout } from './Layout.js';

interface KnowledgeDetailFeatureProps {
  knowledge: Knowledge;
  userId: string;
}

export function KnowledgeDetailFeature({ knowledge, userId }: KnowledgeDetailFeatureProps) {
  const html = marked(knowledge.content);
  const isAuthor = knowledge.authorId === userId;

  return (
    <Layout title={knowledge.title}>
      {/* Header */}
      <header class="bg-main border-b border-border p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-text-main">
          <a href="/">Hocus Pocus</a>
        </h1>
      </header>

      {/* Main Content */}
      <main class="p-4">
        <div class="bg-main p-6 rounded-lg shadow-md">
          <h1 class="text-2xl font-bold text-center text-text-main">{knowledge.title}</h1>
          <div class="text-center text-sm text-text-sub my-4">
            <span>{knowledge.authorId}</span>
            <span class="mx-2">・</span>
            <span>{new Date(knowledge.updatedAt * 1000).toLocaleDateString()}</span>
          </div>
          <article class="prose prose-lg max-w-none">{raw(html)}</article>
        </div>

        <div class="mt-6 flex justify-center items-center space-x-4">
          {isAuthor && <Button path={`/knowledges/${knowledge.knowledgeId}/edit`} text="編集する" variant="primary" />}
          <Button path="/" text="一覧に戻る" variant="secondary" />
        </div>
      </main>
    </Layout>
  );
}
