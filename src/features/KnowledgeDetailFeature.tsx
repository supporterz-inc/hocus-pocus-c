import type { Knowledge } from '../models/knowledge.model.js';

interface Props {
  knowledge: Knowledge;
}
export function KnowledgeDetailFeature({ knowledge }: Props) {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* 💡 title を削り、ナレッジのIDか「ナレッジ詳細」と表示させます */}
      <h1>ナレッジ詳細</h1>
      <p style={{ color: '#666', fontSize: '14px' }}>ID: {knowledge.knowledgeId}</p>
      <hr />

      {/* 💡 本文（content）を表示します */}
      <p style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>{knowledge.content}</p>

      <a href="/" style={{ display: 'block', marginTop: '40px', color: '#0070f3' }}>
        ← トップページに戻る
      </a>
    </div>
  );
}
