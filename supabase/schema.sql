create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Kai Adamson',
  section text not null default 'Mabini',
  grade text not null default 'Grade 4',
  reading_level text not null default 'LEVEL 1 READING EXPLORER',
  agreed_to_privacy boolean not null default false,
  privacy_agreed_at timestamptz,
  last_login_at timestamptz,
  last_streak_login_date date,
  login_streak integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists last_streak_login_date date;
alter table public.profiles add column if not exists login_streak integer not null default 1;

create table if not exists public.privacy_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  consented_at timestamptz not null default now(),
  consent_text text not null default 'Student/parent agreed to camera, microphone, and secure teacher review processing.',
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id text primary key,
  title text not null,
  book_number integer not null unique,
  is_required boolean not null default true,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.books add column if not exists is_published boolean not null default true;

create table if not exists public.book_contents (
  book_id text primary key references public.books(id) on delete cascade,
  estimated_minutes integer not null default 3,
  passage_paragraphs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.book_questions (
  id uuid primary key default gen_random_uuid(),
  book_id text not null references public.books(id) on delete cascade,
  sort_order integer not null,
  exercise_label text not null,
  question_text text not null,
  choices jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (book_id, sort_order)
);

create table if not exists public.user_book_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id text not null references public.books(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  score integer not null default 0,
  total_questions integer not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create table if not exists public.reading_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  teacher_name text not null default 'Ma''am Ana',
  title text not null default 'Reading Review',
  book_title text not null default 'The Two Best Friends',
  feedback text not null,
  signature text not null default '- Keep reading and keep blooming!',
  passage_parts jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reading_error_marks (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.reading_reviews(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  error_type text not null check (error_type in ('jumped', 'repetition', 'self-correct', 'mispronounce')),
  word_text text not null,
  tip_text text not null,
  created_at timestamptz not null default now()
);

insert into public.books (id, title, book_number, is_required, is_published) values
  ('book-1', 'The Two Best Friends', 1, true, true)
on conflict (id) do update set
  title = excluded.title,
  book_number = excluded.book_number,
  is_required = excluded.is_required,
  is_published = excluded.is_published;

insert into public.book_contents (book_id, estimated_minutes, passage_paragraphs) values
  (
    'book-1',
    3,
    '[
      "Once there were two friends a squirrel and a puppy. They used to live and play together. The squirrel was very sporty and always won the game. The puppy used to feel bad and thought that it was of no use.",
      "One day, it started raining heavily. The squirrel was in high spirits. He started doing antics but suddenly, lost his balance and fell in the rain water.",
      "He called his friend, the puppy for help. The puppy came to his rescue. The squirrel climbed on its back and reached a safe place. He thanked his friend for saving his life."
    ]'::jsonb
  )
on conflict (book_id) do update set
  estimated_minutes = excluded.estimated_minutes,
  passage_paragraphs = excluded.passage_paragraphs;

insert into public.book_questions (book_id, sort_order, exercise_label, question_text, choices, correct_answer) values
  ('book-1', 1, 'EXERCISE 1', 'Who are the two best friends in the Story?', '["Squirrel and Puppy", "Cat and Donkey", "Turtle and Rabbit"]'::jsonb, 'Squirrel and Puppy'),
  ('book-1', 2, 'EXERCISE 2', 'Who saved the squirrel?', '["Puppy", "Cat", "Rabbit", "Turtle"]'::jsonb, 'Puppy'),
  ('book-1', 3, 'EXERCISE 3', 'Where did the squirrel fall?', '["In the river", "In the rain water", "From a tree", "In the mud"]'::jsonb, 'In the rain water')
on conflict (book_id, sort_order) do update set
  exercise_label = excluded.exercise_label,
  question_text = excluded.question_text,
  choices = excluded.choices,
  correct_answer = excluded.correct_answer;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists user_book_progress_touch_updated_at on public.user_book_progress;
create trigger user_book_progress_touch_updated_at
before update on public.user_book_progress
for each row execute function public.touch_updated_at();

drop trigger if exists book_contents_touch_updated_at on public.book_contents;
create trigger book_contents_touch_updated_at
before update on public.book_contents
for each row execute function public.touch_updated_at();

drop trigger if exists book_questions_touch_updated_at on public.book_questions;
create trigger book_questions_touch_updated_at
before update on public.book_questions
for each row execute function public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.privacy_consents enable row level security;
alter table public.books enable row level security;
alter table public.book_contents enable row level security;
alter table public.book_questions enable row level security;
alter table public.user_book_progress enable row level security;
alter table public.reading_reviews enable row level security;
alter table public.reading_error_marks enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can add their consent" on public.privacy_consents;
create policy "Users can add their consent"
on public.privacy_consents for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can read their consent history" on public.privacy_consents;
create policy "Users can read their consent history"
on public.privacy_consents for select
using (auth.uid() = user_id);

drop policy if exists "Authenticated users can read books" on public.books;
create policy "Authenticated users can read books"
on public.books for select
to authenticated
using (true);

drop policy if exists "Authenticated users can read book contents" on public.book_contents;
create policy "Authenticated users can read book contents"
on public.book_contents for select
to authenticated
using (true);

drop policy if exists "Authenticated users can read book questions" on public.book_questions;
create policy "Authenticated users can read book questions"
on public.book_questions for select
to authenticated
using (true);

drop policy if exists "Users can manage their progress" on public.user_book_progress;
create policy "Users can manage their progress"
on public.user_book_progress for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can read their reviews" on public.reading_reviews;
create policy "Users can read their reviews"
on public.reading_reviews for select
using (auth.uid() = user_id);

drop policy if exists "Users can read their review marks" on public.reading_error_marks;
create policy "Users can read their review marks"
on public.reading_error_marks for select
using (auth.uid() = user_id);
