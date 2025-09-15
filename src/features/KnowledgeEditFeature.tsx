import type { Knowledge } from '../models/knowledge.model.js';
import { Layout } from './Layout.js';

interface KnowledgeEditFeatureProps {
  knowledge: Knowledge;
}

export function KnowledgeEditFeature({ knowledge }: KnowledgeEditFeatureProps) {
  return (
    <Layout title="ナレッジ更新">
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
          <form action={`/knowledges/${knowledge.knowledgeId}`} class="space-y-4" method="post">
            <div>
              <label class="block text-sm font-medium text-text-sub mb-1" for="title">
                タイトル
              </label>
              <input
                class="w-full rounded-md border-border p-2 border focus:border-accent focus:ring-1 focus:ring-accent"
                id="title"
                name="title"
                type="text"
                value={knowledge.title}
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
              >
                {knowledge.content}
              </textarea>
            </div>
            <div class="flex justify-end">
              <button
                class="bg-accent hover:brightness-90 text-text-main font-bold py-2 px-4 rounded transition-all"
                type="submit"
              >
                更新する
              </button>
            </div>
          </form>
        </div>

        <div class="mt-8 border-t border-border pt-6">
          <h2 class="text-lg font-bold text-text-main mb-2">ナレッジの削除</h2>
          <p class="text-sm text-text-sub mb-4">この操作は元に戻せません。ご注意ください。</p>
          <form action={`/knowledges/${knowledge.knowledgeId}/delete`} class="text-right" method="post">
            <button
              class="bg-transparent hover:bg-red-100 text-red-500 font-bold py-2 px-4 rounded transition-all"
              onClick={(e) => {
                if (!window.confirm('本当にこのナレッジを削除しますか？')) e.preventDefault();
              }}
              type="submit"
            >
              このナレッジを削除する
            </button>
          </form>
        </div>
      </main>
    </Layout>
  );
}
