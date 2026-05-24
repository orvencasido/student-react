import { requireSupabase } from './supabase';

export const DEFAULT_PROFILE = {
  full_name: 'Kai Adamson',
  section: 'Mabini',
  grade: 'Grade 4',
  reading_level: 'LEVEL 1 READING EXPLORER',
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const EMPTY_QUEST = {
  book: null,
  content: {
    estimated_minutes: 3,
    passage_paragraphs: [],
  },
  questions: [],
};

export const DEFAULT_REVIEW = {
  teacher_name: '',
  title: 'Reading Review',
  book_title: 'No review yet',
  feedback: 'Teacher feedback will appear here after a reading activity is reviewed.',
  signature: '',
  passage_parts: [],
  counts: {},
};

function mapProfile(profile, email) {
  return {
    id: profile.id,
    name: profile.full_name || DEFAULT_PROFILE.full_name,
    email,
    section: profile.section || DEFAULT_PROFILE.section,
    grade: profile.grade || DEFAULT_PROFILE.grade,
    level: profile.reading_level || DEFAULT_PROFILE.reading_level,
    lastLogin: profile.last_login_at
      ? new Date(profile.last_login_at).toLocaleDateString()
      : new Date().toLocaleDateString(),
    loginStreak: profile.login_streak || 1,
    agreedToPrivacy: Boolean(profile.agreed_to_privacy),
  };
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function nextLoginStreak(profile) {
  const today = startOfLocalDay(new Date());
  if (!profile?.last_streak_login_date) return 1;

  const previous = startOfLocalDay(new Date(profile.last_streak_login_date));
  const dayDifference = Math.round((today - previous) / MS_PER_DAY);

  if (dayDifference === 0) return profile.login_streak || 1;
  if (dayDifference === 1) return (profile.login_streak || 0) + 1;
  return 1;
}

export async function ensureStudentProfile(sessionUser) {
  const client = requireSupabase();
  const email = sessionUser.email || '';
  const metadata = sessionUser.user_metadata || {};

  const { data: existing, error: fetchError } = await client
    .from('profiles')
    .select('*')
    .eq('id', sessionUser.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (!existing) {
    const { data: created, error: createError } = await client
      .from('profiles')
      .insert({
        id: sessionUser.id,
        full_name: metadata.full_name || DEFAULT_PROFILE.full_name,
        section: metadata.section || DEFAULT_PROFILE.section,
        grade: metadata.grade || DEFAULT_PROFILE.grade,
        reading_level: DEFAULT_PROFILE.reading_level,
        last_login_at: new Date().toISOString(),
        last_streak_login_date: new Date().toISOString().slice(0, 10),
        login_streak: 1,
      })
      .select('*')
      .single();

    if (createError) throw createError;
    return mapProfile(created, email);
  }

  const { data: updated, error: updateError } = await client
    .from('profiles')
    .update({
      last_login_at: new Date().toISOString(),
      last_streak_login_date: new Date().toISOString().slice(0, 10),
      login_streak: nextLoginStreak(existing),
    })
    .eq('id', sessionUser.id)
    .select('*')
    .single();

  if (updateError) throw updateError;
  return mapProfile(updated, email);
}

export async function savePrivacyConsent(userId) {
  const client = requireSupabase();
  const consentedAt = new Date().toISOString();

  const { error: consentError } = await client
    .from('privacy_consents')
    .insert({ user_id: userId, consented_at: consentedAt });

  if (consentError) throw consentError;

  const { data, error } = await client
    .from('profiles')
    .update({ agreed_to_privacy: true, privacy_agreed_at: consentedAt })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateStudentProfile(userId, updates) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .update({
      full_name: updates.name,
      section: updates.section,
      grade: updates.grade,
      reading_level: updates.level,
    })
    .eq('id', userId)
    .select('*')
    .single();

  if (error) throw error;
  return mapProfile(data, updates.email);
}

export async function loadDashboard(userId) {
  const client = requireSupabase();
  const [{ data: books, error: booksError }, { data: progress, error: progressError }] = await Promise.all([
    client.from('books').select('*').eq('is_published', true).order('book_number'),
    client.from('user_book_progress').select('*').eq('user_id', userId),
  ]);

  if (booksError) throw booksError;
  if (progressError) throw progressError;

  const bookList = books || [];
  const progressByBook = new Map((progress || []).map(item => [item.book_id, item]));
  const completedCount = [...progressByBook.values()].filter(item => item.status === 'completed').length;
  const currentLevel = completedCount + 1;

  return {
    currentLevel,
    levelText: `LEVEL ${currentLevel} READING EXPLORER`,
    books: bookList.map((book, index) => {
      const itemProgress = progressByBook.get(book.id);
      const previousBook = bookList[index - 1];
      const previousDone = !previousBook || progressByBook.get(previousBook.id)?.status === 'completed';
      return {
        ...book,
        status: itemProgress?.status || 'not_started',
        score: itemProgress?.score || 0,
        unlocked: index === 0 || previousDone,
      };
    }),
    skills: [
      { name: 'Reading', level: currentLevel, kind: 'reading' },
      { name: 'Vocabulary', level: currentLevel, kind: 'vocabulary' },
    ],
    achievements: [
      { name: 'Word Master', level: currentLevel, kind: 'wordmaster' },
      { name: 'Comprehension', level: currentLevel, kind: 'comp' },
    ],
  };
}

export async function loadJourney(userId) {
  const client = requireSupabase();
  const [
    { data: books, error: booksError },
    { data: progress, error: progressError },
    { data: profile, error: profileError },
  ] = await Promise.all([
    client.from('books').select('id').eq('is_published', true),
    client.from('user_book_progress').select('book_id, status').eq('user_id', userId),
    client.from('profiles').select('login_streak').eq('id', userId).single(),
  ]);

  if (booksError) throw booksError;
  if (progressError) throw progressError;
  if (profileError) throw profileError;

  const totalBooks = books?.length || 0;
  const publishedBookIds = new Set((books || []).map(book => book.id));
  const completedBooks = (progress || []).filter(item => (
    item.status === 'completed' && publishedBookIds.has(item.book_id)
  )).length;
  const currentLevel = completedBooks + 1;

  return {
    learning_completed: completedBooks,
    learning_required: totalBooks,
    days_streak: profile?.login_streak || 1,
    achievement: `LEVEL ${currentLevel} READING EXPLORER`,
  };
}

export async function loadLatestReview(userId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('reading_reviews')
    .select('*, reading_error_marks(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return DEFAULT_REVIEW;

  const marks = data.reading_error_marks || [];
  const counts = marks.reduce((acc, mark) => {
    acc[mark.error_type] = (acc[mark.error_type] || 0) + 1;
    return acc;
  }, {});

  return {
    ...DEFAULT_REVIEW,
    ...data,
    passage_parts: data.passage_parts || [],
    counts,
  };
}

export async function loadBookQuest(bookId) {
  const client = requireSupabase();
  const [
    { data: book, error: bookError },
    { data: content, error: contentError },
    { data: questions, error: questionError },
  ] = await Promise.all([
    client.from('books').select('*').eq('id', bookId).eq('is_published', true).maybeSingle(),
    client.from('book_contents').select('*').eq('book_id', bookId).maybeSingle(),
    client.from('book_questions').select('*').eq('book_id', bookId).order('sort_order'),
  ]);

  if (bookError) throw bookError;
  if (contentError) throw contentError;
  if (questionError) throw questionError;

  return {
    book,
    content: content || EMPTY_QUEST.content,
    questions: (questions || []).map((item, index) => ({
      exercise: item.exercise_label || `EXERCISE ${index + 1}`,
      question: item.question_text,
      choices: item.choices || [],
      answer: item.correct_answer,
    })),
  };
}

export async function saveQuestCompletion(userId, bookId, score, totalQuestions) {
  const client = requireSupabase();

  const { error: progressError } = await client
    .from('user_book_progress')
    .upsert({
      user_id: userId,
      book_id: bookId,
      status: 'completed',
      score,
      total_questions: totalQuestions,
      completed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,book_id' });

  if (progressError) throw progressError;
}
