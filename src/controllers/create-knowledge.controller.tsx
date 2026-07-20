import { CreateKnowledgeFeature } from '../features/CreateKnowledgeFeature.js';

export function createKnowledgeController(userId: string) {
  return <CreateKnowledgeFeature userId={userId} />;
}
