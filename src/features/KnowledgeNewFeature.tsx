import { Layout } from './Layout.js';

export function KnowledgeNewFeature() {
  return (
    <Layout title="新規ナレッジ投稿">
      <form action="/knowledges" className="flex flex-col gap-y-4" method="post">
        <input
          className="w-full rounded-md border border-gray-300 p-2"
          name="title"
          placeholder="タイトル"
          type="text"
        />
        <textarea
          className="h-96 w-full resize-y rounded-md border border-gray-300 p-2"
          name="content"
          placeholder="ナレッジを Markdown 形式で記述..."
        ></textarea>
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" type="submit">
          投稿する
        </button>
      </form>
    </Layout>
  );
}
