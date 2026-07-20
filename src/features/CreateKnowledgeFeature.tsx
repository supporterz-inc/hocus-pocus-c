import type { Child } from 'hono/jsx';

interface CreateKnowledgeFeatureProps {
  userId: string;
}

// 💡 userId の警告を消すため、一旦 {} にしています
// 💡 引数の {} を props に変更し、中身の label に htmlFor を追加して input と紐付けます

export function CreateKnowledgeFeature(_props: CreateKnowledgeFeatureProps): Child {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ナレッジの新規作成</h1>

      <form action="/knowledges" className="space-y-4" method="post">
        <div>
          {/* 💡 htmlFor="title" を追加 */}
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
            タイトル
          </label>
          <input
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            id="title" // 💡 id="title" を追加して label と紐付ける
            name="title"
            required
            type="text"
          />
        </div>

        <div>
          {/* 💡 htmlFor="content" を追加 */}
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">
            本文
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            id="content" // 💡 id="content" を追加して label と紐付ける
            name="content"
            required
            rows={5}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <a
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            href="/"
          >
            キャンセル
          </a>
          <button
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition shadow-sm"
            type="submit"
          >
            投稿する
          </button>
        </div>
      </form>
    </div>
  );
}
