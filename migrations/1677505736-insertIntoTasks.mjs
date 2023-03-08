const tasks = [
  { id: 1, list_id: 1, title: 'Suppe' },
  { id: 2, list_id: 2, title: 'Saft' },
  { id: 3, list_id: 3, title: 'Salz' },
  { id: 4, list_id: 1, title: 'A slightly longer title' },
  { id: 5, list_id: 4, title: 'random item' },
  { id: 6, list_id: 5, title: 'Suppe' },
  { id: 7, list_id: 6, title: 'Saft' },
  { id: 8, list_id: 3, title: 'Salz' },
  { id: 9, list_id: 5, title: 'This is a longer title for testing' },
  { id: 10, list_id: 1, title: 'random item' },
];

export async function up(sql) {
  await sql`
      INSERT INTO tasks ${sql(tasks, 'list_id', 'title')}
  `;
}

export async function down(sql) {
  for (const task of tasks) {
    await sql`
      DELETE FROM
        tasks
      WHERE
        id = ${task.id}
    `;
  }
}
