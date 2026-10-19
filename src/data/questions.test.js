import assert from 'node:assert/strict';
import test from 'node:test';
import { QUESTIONS, shuffleQuestions } from './questions.js';

test('shuffleQuestions retains every question exactly once', () => {
  const shuffled = shuffleQuestions(QUESTIONS);

  assert.equal(shuffled.length, QUESTIONS.length);
  assert.deepEqual(
    shuffled.map((question) => question.id).sort((a, b) => a - b),
    QUESTIONS.map((question) => question.id).sort((a, b) => a - b)
  );
});

test('a reshuffled round does not begin with the last displayed question', () => {
  QUESTIONS.forEach((question) => {
    const shuffled = shuffleQuestions(QUESTIONS, question.id);
    assert.notEqual(shuffled[0].id, question.id);
  });
});
