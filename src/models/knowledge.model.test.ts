import { describe, expect, it } from 'vitest';
import { Knowledge } from './knowledge.model.js';

describe('Create Knowledge', () => {
  it('Knowledge が作成できる', () => {
    const title = 'This is a test title.';
    const content = 'This is a test content.';
    const authorId = 'test-author';
    const knowledge = Knowledge.create(content, authorId, title);

    expect(knowledge.title).toBe(title);
    expect(knowledge.content).toBe(content);
    expect(knowledge.authorId).toBe(authorId);
    expect(knowledge.createdAt).toEqual(knowledge.updatedAt);
  });
});

describe('Update Knowledge', () => {
  it('Knowledge が更新できる', () => {
    const original = Knowledge.create('This is an original content', 'test-author', 'This is an original title');
    const title = 'This is an updated title.';
    const content = 'This is an updated content.';

    setTimeout(() => {
      const updated = Knowledge.update(original, content, title);

      expect(updated.knowledgeId).toBe(original.knowledgeId);
      expect(updated.title).toBe(title);
      expect(updated.content).toBe(content);
      expect(updated.authorId).toBe(original.authorId);
      expect(updated.createdAt).toEqual(original.createdAt);
      expect(updated.updatedAt).toBeGreaterThan(original.updatedAt);
    }, 100);
  });
});
