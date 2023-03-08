export async function up(sql) {
  await sql`
    CREATE TABLE tasks (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      list_id integer REFERENCES lists (id) ON DELETE CASCADE,
      title varchar(50) NOT NULL,
      done boolean default false,
      due_date date,
      in_use boolean default false,
      created_at timestamp default current_timestamp
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE tasks
  `;
}
