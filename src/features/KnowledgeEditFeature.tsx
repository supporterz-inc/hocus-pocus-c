import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface KnowledgeEditFeatureProps {
  knowledge: Knowledge;
}

export function KnowledgeEditFeature({ knowledge }: KnowledgeEditFeatureProps) {
  console.log(knowledge);
  return (
    <Layout title="ナレッジ更新">
      <form action={`/knowledges/${knowledge.knowledgeId}`} className="flex flex-col gap-y-4" method="post">
        <textarea className="h-96 w-full resize-y rounded-md border border-gray-300 p-2" name="content">
          {knowledge.content}
        </textarea>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" type="submit">
          更新する
        </button>
      </form>
    </Layout>
  );
}
