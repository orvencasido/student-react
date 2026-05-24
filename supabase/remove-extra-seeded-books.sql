-- Run this once in Supabase SQL Editor if books 2-4 were already inserted.
-- Related content/progress rows are deleted automatically through foreign keys.

delete from public.books
where id in ('book-2', 'book-3', 'book-4');
