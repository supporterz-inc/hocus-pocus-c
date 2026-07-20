import type { Child } from 'hono/jsx';
import { KnowledgeDetailFeature } from '../features/KnowledgeDetailFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';
export async function getKnowledgeController(knowledgeId: string): Promise<Child> {
  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);
  if (!knowledge) {
    return <div>指定されたナレッジが見つかりませんでした。</div>;
  }
  return <KnowledgeDetailFeature knowledge={knowledge} />;
}
