export async function up(sql) {
  await sql`
    CREATE TABLE lists (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title varchar(50) NOT NULL,
      description varchar(255),
      created_at timestamp default current_timestamp
    )
  `;
}

export async function down(sql) {
  await sql`
    DROP TABLE lists
  `;
}
