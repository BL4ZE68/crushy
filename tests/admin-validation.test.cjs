const test = require('node:test');
const assert = require('node:assert/strict');
const { validateAdminForm } = require('../node_modules/.cache/crushy-tests/admin/validation.js');

const validSurprise = {
  title: 'Pour les jours de pluie',
  body: 'Tu as le droit de prendre ton temps.',
  kind: 'compliment',
  category_id: '',
  unlock_xp: '0',
  scheduled_at: '2026-12-24T18:30:00.000Z',
  is_published: 'true',
};

test('admin surprise validation normalizes the scheduled date and publication state', () => {
  const result = validateAdminForm('surprises', validSurprise);
  assert.equal('error' in result, false);
  assert.equal(result.data.unlock_xp, 0);
  assert.equal(result.data.is_published, true);
  assert.equal(result.data.scheduled_at, '2026-12-24T18:30:00.000Z');
});

test('admin publication rejects impossible dates and excessive XP values', () => {
  const invalidDate = validateAdminForm('citations', {
    content: 'Une citation originale.',
    mood: '',
    available_on: '2026-02-31',
    is_published: 'false',
  });
  assert.equal('error' in invalidDate, true);

  const excessiveXp = validateAdminForm('surprises', { ...validSurprise, unlock_xp: '100001' });
  assert.equal('error' in excessiveXp, true);
});

test('admin music links allow only Spotify and YouTube Music URLs', () => {
  const base = {
    title: 'Morceau',
    artist: 'Artiste',
    mood: 'rêveuse',
    genre: 'Indie',
    category_id: '',
    is_published: 'false',
  };
  assert.equal('error' in validateAdminForm('music', {
    ...base,
    platform_url: 'https://open.spotify.com/track/example',
  }), false);
  assert.equal('error' in validateAdminForm('music', {
    ...base,
    platform_url: 'https://attacker.example/music',
  }), true);
});

test('admin choice questions require two options and a valid game ID', () => {
  const form = {
    game_id: '00000000-0000-4000-8000-000000000001',
    category_id: '',
    prompt: 'Tu préfères ?',
    kind: 'choice',
    choices: 'Une promenade',
    answer: '',
    hints: '',
    reactions: '',
    is_published: 'false',
  };
  assert.equal('error' in validateAdminForm('questions', form), true);

  const valid = validateAdminForm('questions', {
    ...form,
    choices: 'Une promenade\nUne soirée film',
    reactions: 'Ça sent le soleil !\nPop-corn et plaid !',
  });
  assert.equal('error' in valid, false);
  assert.deepEqual(valid.data.choices, ['Une promenade', 'Une soirée film']);
});
