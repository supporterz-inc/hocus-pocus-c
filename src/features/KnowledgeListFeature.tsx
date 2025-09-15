import type { Knowledge } from '../models/knowledge.model.js';
import { Button } from './Button.js';
import { Layout } from './Layout.js';

interface Props {
  userId: string;
  knowledges: Knowledge[];
}

export function KnowledgeListFeature({ userId, knowledges }: Props) {
  return (
    <Layout title="ナレッジ一覧">
      {/* Header */}
      <header class="bg-main border-b border-border p-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-text-main ">
          <a href="/">Hocus Pocus</a>
        </h1>
      </header>

      {/* Main Content */}
      <main class="p-4 space-y-4">
        <p class="text-center text-text-sub">
          こんにちは <span class="font-bold text-text-main">{userId}</span> さん
        </p>

        <div class="flex justify-center">
          <Button path="/knowledges/new" text="ナレッジを新規作成する" />
        </div>

        {knowledges.length ? (
          <div class="space-y-4">
            {knowledges.map((knowledge) => (
              <a class="block" href={`/knowledges/${knowledge.knowledgeId}`} key={knowledge.knowledgeId}>
                <div class="bg-main p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h2 class="text-lg font-bold text-text-main">{knowledge.title}</h2>
                  <div class="text-sm text-text-sub mt-2">
                    <span>{knowledge.authorId}</span>
                    <span class="mx-2">・</span>
                    <span>{new Date(knowledge.updatedAt * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div class="bg-main p-8 rounded-lg shadow-md text-center text-text-sub">
            <p>投稿済みのナレッジは 0 件です</p>
          </div>
        )}
      </main>
    </Layout>
  );
}
