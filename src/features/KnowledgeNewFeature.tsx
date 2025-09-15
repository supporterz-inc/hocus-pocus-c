import { Layout } from './Layout.js';

export function KnowledgeNewFeature() {
  return (
    <Layout title="新規ナレッジ投稿">
      {/* Header */}
      <header class="bg-main border-b border-border p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-text-main ">
          <a
            class="bg-lime-500 border border-lime-600 text-white font-extrabold text-2xl leading-none px-4 py-2 rounded-lg shadow inline-block"
            href="/"
          >
            Hocus Pocus
          </a>
        </h1>
      </header>

      {/* Main Content */}
      <main class="p-4">
        <div class="bg-main p-6 rounded-lg shadow-md">
          <form action="/knowledges" class="space-y-4" method="post">
            <div>
              <label class="block text-sm font-medium text-text-sub mb-1" for="title">
                タイトル
              </label>
              <input
                class="w-full rounded-md border-border p-2 border focus:border-accent focus:ring-1 focus:ring-accent"
                id="title"
                name="title"
                placeholder="ナレッジのタイトル"
                type="text"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-text-sub mb-1" for="content">
                本文
              </label>
              <textarea
                class="h-96 w-full resize-y rounded-md border-border p-2 border focus:border-accent focus:ring-1 focus:ring-accent"
                id="content"
                name="content"
                placeholder="ナレッジを Markdown 形式で記述..."
              ></textarea>
            </div>
            <div class="flex justify-end">
              <button
                class="bg-accent hover:brightness-90 text-text-main font-bold py-2 px-4 rounded transition-all"
                type="submit"
              >
                投稿する
              </button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  );
}
