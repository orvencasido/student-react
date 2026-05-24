# ReadBloom Supabase Content Model

Books are split into three content tables:

- `books`: the book listing shown on the dashboard.
- `book_contents`: the read-aloud passage and estimated reading time.
- `book_questions`: the quiz questions, choices, and correct answers.

To add content from Supabase Console:

1. Open your project in Supabase.
2. Go to `SQL Editor`.
3. Run `schema.sql` once if you have not already.
4. Copy `add-book-example.sql`.
5. Change the book id, title, book number, passage, questions, choices, and correct answers.
6. Run the query.

After that, refresh the React app. The new book appears on the dashboard if `is_published` is `true`.
