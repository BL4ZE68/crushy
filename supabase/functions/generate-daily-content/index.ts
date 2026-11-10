import '@supabase/functions-js/edge-runtime.d.ts';

type Mood = 'heureuse' | 'triste' | 'amoureuse' | 'énergique' | 'fatiguée' | 'rêveuse';

type MoodContent = {
  mood: Mood;
  quote: string;
  joke: string;
  thought: string;
  question: string;
};

type DailyPayload = {
  moods: MoodContent[];
  challenge: {
    title: string;
    description: string;
  };
};

const moods: Mood[] = ['heureuse', 'triste', 'amoureuse', 'énergique', 'fatiguée', 'rêveuse'];
const contentTypes = ['quote', 'joke', 'thought', 'question'] as const;
const responseSchema = {
  type: 'object',
  properties: {
    moods: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          mood: { type: 'string', enum: moods },
          quote: { type: 'string' },
          joke: { type: 'string' },
          thought: { type: 'string' },
          question: { type: 'string' },
        },
        required: ['mood', 'quote', 'joke', 'thought', 'question'],
        additionalProperties: false,
      },
    },
    challenge: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['title', 'description'],
      additionalProperties: false,
    },
  },
  required: ['moods', 'challenge'],
  additionalProperties: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== 'string') throw new Error(`Invalid generated field: ${field}`);
  const text = value.trim();
  if (!text || text.length > maxLength) throw new Error(`Invalid generated field: ${field}`);
  return text;
}

function parseDailyPayload(value: unknown): DailyPayload {
  if (!isRecord(value) || !Array.isArray(value.moods) || !isRecord(value.challenge)) {
    throw new Error('Invalid generated content shape.');
  }

  const parsedMoods = value.moods.map((item): MoodContent => {
    if (!isRecord(item) || typeof item.mood !== 'string' || !moods.includes(item.mood as Mood)) {
      throw new Error('Invalid generated mood.');
    }

    return {
      mood: item.mood as Mood,
      quote: requiredText(item.quote, 'quote', 320),
      joke: requiredText(item.joke, 'joke', 320),
      thought: requiredText(item.thought, 'thought', 320),
      question: requiredText(item.question, 'question', 320),
    };
  });

  if (parsedMoods.length !== moods.length || new Set(parsedMoods.map((item) => item.mood)).size !== moods.length) {
    throw new Error('Generated content must include each mood exactly once.');
  }

  return {
    moods: parsedMoods,
    challenge: {
      title: requiredText(value.challenge.title, 'challenge.title', 120),
      description: requiredText(value.challenge.description, 'challenge.description', 500),
    },
  };
}

function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function getSupabaseSecretKey(): string {
  const secretKeys = Deno.env.get('SUPABASE_SECRET_KEYS');
  if (secretKeys) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(secretKeys);
    } catch {
      throw new Error('Supabase secret key configuration is invalid.');
    }
    if (isRecord(parsed) && typeof parsed.default === 'string') return parsed.default;
  }

  const legacyServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (legacyServiceKey) return legacyServiceKey;
  throw new Error('Supabase server key is not configured.');
}

function getGroqOutputText(response: unknown): string {
  if (!isRecord(response) || !Array.isArray(response.choices)) {
    throw new Error('Groq returned an invalid response.');
  }

  const choice = response.choices[0];
  if (!isRecord(choice) || !isRecord(choice.message) || typeof choice.message.content !== 'string') {
    throw new Error('Groq returned no generated text.');
  }
  if (choice.finish_reason && choice.finish_reason !== 'stop') {
    throw new Error('Groq did not complete the generated response.');
  }
  return choice.message.content;
}

async function requestJson<T>(url: URL, apiKey: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error(`Supabase request failed with status ${response.status}.`);
  return await response.json() as T;
}

async function upsertRows(url: URL, apiKey: string, rows: unknown[]): Promise<void> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });
  if (!response.ok) throw new Error(`Supabase write failed with status ${response.status}.`);
}

async function generateDailyPayload(apiKey: string): Promise<DailyPayload> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b',
      messages: [
        {
          role: 'system',
          content: [
            'Tu crées le contenu quotidien original de CRUSHY, une application de bien-être ludique.',
            'Écris en français naturel, chaleureux et inclusif, en tutoyant.',
            'Le contenu doit convenir à tout public : aucune sexualisation, violence, humiliation, diagnostic ou conseil médical.',
            'Pour la tristesse et la fatigue, sois doux sans minimiser les émotions ni imposer de positivité.',
            'N’attribue jamais une citation à une personne réelle et n’imite pas un auteur connu.',
            'Crée un texte inédit, concret et bref pour chaque humeur et chaque type demandé.',
            'Le défi doit être simple, facultatif, sûr, réalisable sans achat ni partage d’information personnelle.',
          ].join(' '),
        },
        {
          role: 'user',
          content: 'Génère un contenu entièrement nouveau pour la date du jour : une citation, une blague légère, une pensée et une question pour chacune des six humeurs heureuse, triste, amoureuse, énergique, fatiguée et rêveuse, ainsi qu’un défi commun du jour.',
        },
      ],
      max_completion_tokens: 3000,
      reasoning_effort: 'low',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'crushy_daily_content',
          strict: true,
          schema: responseSchema,
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`Groq request failed with status ${response.status}.`);
  return parseDailyPayload(JSON.parse(getGroqOutputText(await response.json())));
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed.' }, { status: 405 });
  }

  const expectedSecret = Deno.env.get('DAILY_CONTENT_CRON_SECRET');
  const receivedSecret = request.headers.get('x-cron-secret') ?? '';
  if (!expectedSecret || !constantTimeEqual(receivedSecret, expectedSecret)) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const groqApiKey = Deno.env.get('GROQ_API_KEY');
  if (!groqApiKey) {
    return Response.json({ error: 'AI generation is not configured.' }, { status: 503 });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    if (!supabaseUrl) throw new Error('Supabase URL is not configured.');
    const supabaseKey = getSupabaseSecretKey();
    const date = new Date().toISOString().slice(0, 10);
    const dailyUrl = new URL('/rest/v1/daily_contents', supabaseUrl);
    const challengeUrl = new URL('/rest/v1/challenges', supabaseUrl);

    const dailyQuery = new URL(`${dailyUrl}?select=generation_key`);
    dailyQuery.searchParams.set('available_on', `eq.${date}`);
    dailyQuery.searchParams.set('generation_key', 'not.is.null');
    dailyQuery.searchParams.set('is_published', 'eq.true');
    const challengeQuery = new URL(`${challengeUrl}?select=generation_key`);
    challengeQuery.searchParams.set('generation_key', `eq.${date}:challenge`);
    challengeQuery.searchParams.set('is_published', 'eq.true');

    const [existingDaily, existingChallenges] = await Promise.all([
      requestJson<Array<{ generation_key: string | null }>>(dailyQuery, supabaseKey),
      requestJson<Array<{ generation_key: string | null }>>(challengeQuery, supabaseKey),
    ]);
    const expectedKeys = moods.flatMap((mood) =>
      contentTypes.map((contentType) => `${date}:${mood}:${contentType}`)
    );
    const existingKeys = new Set(existingDaily.map((item) => item.generation_key));
    const completeDaily = expectedKeys.every((key) => existingKeys.has(key));
    const completeChallenge = existingChallenges.some((item) => item.generation_key === `${date}:challenge`);
    if (completeDaily && completeChallenge) {
      return Response.json({ date, generated: false, reason: 'already_exists' });
    }

    const payload = await generateDailyPayload(groqApiKey);
    const dailyRows = payload.moods.flatMap((item) =>
      contentTypes.map((contentType) => ({
        generation_key: `${date}:${item.mood}:${contentType}`,
        content_type: contentType,
        content: item[contentType],
        mood: item.mood,
        available_on: date,
        is_published: true,
      }))
    );

    const dailyUpsertUrl = new URL(dailyUrl);
    dailyUpsertUrl.searchParams.set('on_conflict', 'generation_key');
    const challengeUpsertUrl = new URL(challengeUrl);
    challengeUpsertUrl.searchParams.set('on_conflict', 'generation_key');
    await upsertRows(dailyUpsertUrl, supabaseKey, dailyRows);
    await upsertRows(challengeUpsertUrl, supabaseKey, [{
      generation_key: `${date}:challenge`,
      title: payload.challenge.title,
      description: payload.challenge.description,
      xp_reward: 5,
      available_at: `${date}T00:00:00.000Z`,
      is_published: true,
    }]);

    return Response.json({ date, generated: true, items: dailyRows.length + 1 });
  } catch (error) {
    console.error('Daily AI content generation failed.', error);
    return Response.json({ error: 'Daily content generation failed.' }, { status: 500 });
  }
});
