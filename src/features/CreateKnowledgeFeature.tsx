import { Layout } from './Layout.js';

interface Props {
  userId: string;
}

export function CreateKnowledgeFeature({ userId }: Props) {
  return (
    <Layout title="ナレッジ作成">
      <p>
        こんにちは <span class="text-blue-500 font-bold">{userId}</span> さん
      </p>

      <form class="space-y-4" id="create-form">
        <div>
          <label class="block font-medium mb-1" htmlFor="content">
            本文（Markdown）
          </label>
          <textarea
            class="w-full p-2 border rounded"
            id="content"
            placeholder="Markdown形式で記述してください"
            rows={12}
          />
        </div>

        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" type="submit">
          投稿
        </button>
      </form>

      <script>{`
        document.getElementById('create-form')?.addEventListener('submit', async (e) => {
          e.preventDefault();
          const content = document.getElementById('content')?.value || '';
          if (!content.trim()) {
            alert('本文を入力してください');
            return;
          }
          const res = await fetch('/knowledges', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
          });
          if (res.ok) location.href = '/';
          else alert('投稿に失敗しました');
        });
      `}</script>
    </Layout>
  );
}
