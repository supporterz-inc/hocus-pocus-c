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
      <p className="text-center">
        こんにちは <span class="text-blue-500 font-bold">{userId}</span> さん
      </p>
      <Button path="knowledges/new" text="ナレッジを新規作成する" />
      {knowledges.length ? (
        <ul>
          {knowledges.map((knowledge) => (
            <li key={knowledge.knowledgeId}>
              <a href={`/knowledges/${knowledge.knowledgeId}`}>{knowledge.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <ul>
          <li>投稿済みのナレッジは 0 件です</li>
        </ul>
      )}
    </Layout>
  );
}
