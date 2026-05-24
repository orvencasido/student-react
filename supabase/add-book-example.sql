-- Copy this query in Supabase SQL Editor when you want to add a new book.
-- Change the id, title, book_number, passage paragraphs, questions, choices, and answers.

insert into public.books (id, title, book_number, is_required, is_published) values
  ('book-4', 'The Brave Little Seed', 4, true, true)
on conflict (id) do update set
  title = excluded.title,
  book_number = excluded.book_number,
  is_required = excluded.is_required,
  is_published = excluded.is_published;

insert into public.book_contents (book_id, estimated_minutes, passage_paragraphs) values
  (
    'book-4',
    3,
    '[
      "A little seed slept under the soil while the rain tapped softly above.",
      "When the sun warmed the ground, the seed pushed up a tiny green sprout.",
      "Day by day, it grew taller until it became a bright flower in the garden."
    ]'::jsonb
  )
on conflict (book_id) do update set
  estimated_minutes = excluded.estimated_minutes,
  passage_paragraphs = excluded.passage_paragraphs;

insert into public.book_questions (book_id, sort_order, exercise_label, question_text, choices, correct_answer) values
  (
    'book-4',
    1,
    'EXERCISE 1',
    'Where did the little seed sleep?',
    '["Under the soil", "Inside a house", "On a cloud"]'::jsonb,
    'Under the soil'
  ),
  (
    'book-4',
    2,
    'EXERCISE 2',
    'What warmed the ground?',
    '["The sun", "The moon", "The wind"]'::jsonb,
    'The sun'
  ),
  (
    'book-4',
    3,
    'EXERCISE 3',
    'What did the seed become?',
    '["A flower", "A rock", "A bird"]'::jsonb,
    'A flower'
  )
on conflict (book_id, sort_order) do update set
  exercise_label = excluded.exercise_label,
  question_text = excluded.question_text,
  choices = excluded.choices,
  correct_answer = excluded.correct_answer;
