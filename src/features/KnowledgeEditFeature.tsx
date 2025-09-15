import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface KnowledgeEditFeatureProps {
  knowledge: Knowledge;
}

export function KnowledgeEditFeature({ knowledge }: KnowledgeEditFeatureProps) {
  return (
    <Layout title="ナレッジ更新">
      <form action={`/knowledges/${knowledge.knowledgeId}`} className="flex flex-col gap-y-4" method="post">
        <input
          className="w-full rounded-md border border-gray-300 p-2"
          name="title"
          type="text"
          value={knowledge.title}
        />
        <textarea className="h-96 w-full resize-y rounded-md border border-gray-300 p-2" name="content">
          {knowledge.content}
        </textarea>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" type="submit">
          更新する
        </button>
      </form>
      <div className="mt-8 border-t border-red-400 pt-4">
        <form action={`/knowledges/${knowledge.knowledgeId}/delete`} method="post">
          <button
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            onClick={(e) => {
              if (!window.confirm('本当にこのナレッジを削除しますか？')) e.preventDefault();
            }}
            type="submit"
          >
            このナレッジを削除する
          </button>
        </form>
      </div>
    </Layout>
  );
}
