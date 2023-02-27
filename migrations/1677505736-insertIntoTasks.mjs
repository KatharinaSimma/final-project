const tasks = [
  { id: 1, list_id: 1, title: 'Suppe', description: 'ladida' },
  { id: 2, list_id: 2, title: 'Saft', description: 'beep beep beep' },
  { id: 3, list_id: 3, title: 'Salz', description: 'usw und so fort' },
  {
    id: 4,
    list_id: 1,
    title: 'This is a longer title, blabla',
    description: 'balbla this description is a bit longer',
  },

  { id: 5, list_id: 4, title: 'random item', description: '' },
  { id: 6, list_id: 5, title: 'Suppe', description: 'ladida' },
  { id: 7, list_id: 6, title: 'Saft', description: 'beep beep beep' },
  { id: 8, list_id: 3, title: 'Salz', description: 'usw und so fort' },
  {
    id: 9,
    list_id: 5,
    title: 'This is a longer title, blabla',
    description: 'balbla this description is a bit longer',
  },

  { id: 10, list_id: 1, title: 'random item', description: '' },
];

export async function up(sql) {
  await sql`
      INSERT INTO tasks ${sql(tasks, 'list_id', 'title', 'description')}
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
