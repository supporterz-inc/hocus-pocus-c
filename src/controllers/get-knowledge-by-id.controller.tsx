import { KnowledgeDetailFeature } from '../features/KnowledgeDetailFeature.js';
import { KnowledgeRepository } from '../models/knowledge.repository.js';

export async function getKnowledgeByIdController(userId: string, knowledgeId: string) {
  console.log('Signed-in as', userId);

  const knowledge = await KnowledgeRepository.getByKnowledgeId(knowledgeId);

  return <KnowledgeDetailFeature knowledge={knowledge} userId={userId} />;
}
