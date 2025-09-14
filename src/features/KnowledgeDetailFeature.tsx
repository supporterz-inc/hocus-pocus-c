import { raw } from 'hono/html';
import { marked } from 'marked';
import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface KnowledgeDetailFeatureProps {
  knowledge: Knowledge;
}

export function KnowledgeDetailFeature({ knowledge }: KnowledgeDetailFeatureProps) {
  const html = marked(knowledge.content);

  return (
    <Layout title="ナレッジ詳細表示">
      <article>{raw(html)}</article>
    </Layout>
  );
}
