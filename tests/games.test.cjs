const test = require('node:test');
const assert = require('node:assert/strict');
const {
  didCompleteTimedChallenge,
  evaluateWordGuess,
  gamePrompts,
  getPersonalityOutcome,
  getRandomPrompt,
  isCorrectWordGuess,
  normalizeAnswer,
  personalityProfiles,
  promptCategories,
  wouldYouRatherQuestions,
} = require('../node_modules/.cache/crushy-tests/games/gameData.js');
const {
  getDailyContent,
} = require('../node_modules/.cache/crushy-tests/daily/content.js');
const {
  getMusicSearchUrl,
  getPlaylistSearchUrl,
  musicMoods,
  musicQuotes,
  trackRecommendations,
} = require('../node_modules/.cache/crushy-tests/music/recommendations.js');
const {
  achievements,
  getNewAchievements,
} = require('../node_modules/.cache/crushy-tests/rewards/achievements.js');

test('every truth-or-dare category has truth and action prompts', () => {
  for (const category of promptCategories) {
    for (const kind of ['vérité', 'action']) {
      assert.ok(gamePrompts.some((prompt) => prompt.category === category && prompt.kind === kind));
    }
  }
});

test('random prompt selection avoids the previous prompt when alternatives exist', () => {
  const first = getRandomPrompt('drôle', 'vérité', undefined, () => 0);
  const next = getRandomPrompt('drôle', 'vérité', first.id, () => 0);
  assert.notEqual(next.id, first.id);
  assert.equal(getRandomPrompt('drôle', 'vérité', undefined, () => 1).id, 'fun-truth-2');
});

test('random prompt selection includes published admin questions without repeating the previous one', () => {
  const custom = { id: 'admin-prompt', category: 'crush', kind: 'vérité', text: 'Question personnalisée ?' };
  assert.equal(getRandomPrompt('crush', 'vérité', undefined, () => 0.999999, [custom]).id, custom.id);
  assert.notEqual(getRandomPrompt('crush', 'vérité', custom.id, () => 0, [custom]).id, custom.id);
});

test('word guesses ignore accents, case, spaces and punctuation', () => {
  assert.equal(normalizeAnswer('  Éléphant ! '), 'elephant');
  assert.equal(isCorrectWordGuess('ARC EN CIEL', 'arc-en-ciel'), true);
  assert.equal(isCorrectWordGuess('arc-en-mer', 'arc-en-ciel'), false);
  assert.equal(evaluateWordGuess('arc-en-mer', 'arc-en-ciel', 3), 'incorrect');
  assert.equal(evaluateWordGuess('arc-en-mer', 'arc-en-ciel', 1), 'out-of-attempts');
  assert.equal(evaluateWordGuess('arc en ciel', 'arc-en-ciel', 1), 'correct');
});

test('personality scoring returns the most frequent result and has a stable tie break', () => {
  assert.equal(getPersonalityOutcome(['coeur', 'coeur', 'reveuse', 'rayon']), 'coeur');
  assert.equal(getPersonalityOutcome(['reveuse', 'rayon']), 'rayon');
  assert.ok(personalityProfiles[getPersonalityOutcome([])]);
});

test('timed challenge requires the target before the clock reaches zero', () => {
  assert.equal(didCompleteTimedChallenge(10, 10, 1), true);
  assert.equal(didCompleteTimedChallenge(9, 10, 1), false);
  assert.equal(didCompleteTimedChallenge(10, 10, 0), false);
});

test('would-you-rather game has enough consecutive prompts to complete a session', () => {
  assert.equal(wouldYouRatherQuestions.length, 6);
  assert.equal(new Set(wouldYouRatherQuestions.map((question) => question.id)).size, 6);
  assert.ok(wouldYouRatherQuestions.every((question) => question.choices.length === 2));
});

test('daily content provides all requested items for each mood and stays stable for the local day', () => {
  const date = new Date(2026, 10, 6, 14);
  for (const mood of ['heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse']) {
    const content = getDailyContent(mood, date);
    assert.ok(content.quote);
    assert.ok(content.joke);
    assert.ok(content.challenge);
    assert.ok(content.thought);
    assert.ok(content.question);
    assert.deepEqual(getDailyContent(mood, date), content);
  }
});

test('music suggestions and external search links exist for every mood without embedded audio', () => {
  for (const mood of musicMoods) {
    assert.ok(trackRecommendations[mood].length >= 3);
    assert.ok(musicQuotes[mood]);
    assert.match(getPlaylistSearchUrl(mood, 'spotify'), /^https:\/\/open\.spotify\.com\/search\//);
  }
  assert.match(getMusicSearchUrl('La vie en rose', 'Édith Piaf', 'youtube'), /^https:\/\/music\.youtube\.com\/search\?q=/);
});

test('achievements unlock once when their thresholds are reached', () => {
  const firstGame = getNewAchievements({ 'truth-or-dare': 1 }, 0, []);
  assert.deepEqual(firstGame.map((achievement) => achievement.id), ['first-game']);

  const allGames = {
    'truth-or-dare': 2,
    'would-you-rather': 2,
    'word-guess': 2,
    'personality-quiz': 2,
    'timed-challenge': 2,
  };
  const unlocked = getNewAchievements(allGames, 1, ['first-game', 'first-surprise']);
  assert.ok(unlocked.some((achievement) => achievement.id === 'five-games'));
  assert.ok(unlocked.some((achievement) => achievement.id === 'ten-games'));
  assert.ok(unlocked.some((achievement) => achievement.id === 'hidden-surprise' && achievement.bonusXp === 25));
  assert.ok(unlocked.some((achievement) => achievement.id === 'explorer'));
  assert.deepEqual(getNewAchievements(allGames, 1, achievements.map((achievement) => achievement.id)), []);
});
