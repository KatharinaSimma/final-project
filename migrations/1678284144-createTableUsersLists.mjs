export async function up(sql) {
  await sql`
    CREATE TABLE users_lists (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer REFERENCES users(id) ON DELETE CASCADE,
      list_id integer REFERENCES lists(id),
      created_at timestamp default current_timestamp
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE users_lists
  `;
}
