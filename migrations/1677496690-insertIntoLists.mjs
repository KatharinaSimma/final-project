const lists = [
  {
    id: 1,
    title: 'Billa',
    description: 'Einkaufsliste',
  },
  {
    id: 2,
    title: 'Reading',
    description:
      'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Sum',
  },
  {
    id: 3,
    title: 'Habits',
    description: 'Stuff!',
  },
  {
    id: 4,
    title: 'Penny',
    description: 'Summus brains s morbo vel maleficia? De apocalypsi.',
  },
  {
    id: 5,
    title: 'Obi',
    description: 'Zombie ipsum reversus ab viral inferno.',
  },
  {
    id: 6,
    title: 'Books',
    description: 'Zombie ipsum reversus ab viral inferno.',
  },
];

export async function up(sql) {
  await sql`
      INSERT INTO lists ${sql(lists, 'title', 'description')}
  `;
}

export async function down(sql) {
  for (const list of lists) {
    await sql`
      DELETE FROM
        lists
      WHERE
        id = ${list.id}
    `;
  }
}
