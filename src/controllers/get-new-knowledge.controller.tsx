import { KnowledgeNewFeature } from '../features/KnowledgeNewFeature.js';

export function getNewKnowledgeController(userId: string) {
  console.log('Signed-in as', userId);
  return <KnowledgeNewFeature />;
}
