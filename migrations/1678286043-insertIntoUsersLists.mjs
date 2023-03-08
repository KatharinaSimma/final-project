const usersLists = [
  {
    id: 1,
    user_id: 1,
    list_id: 1,
  },
  {
    id: 2,
    user_id: 2,
    list_id: 1,
  },
  {
    id: 3,
    user_id: 1,
    list_id: 2,
  },
  {
    id: 4,
    user_id: 2,
    list_id: 3,
  },
  {
    id: 5,
    user_id: 1,
    list_id: 3,
  },
  {
    id: 6,
    user_id: 1,
    list_id: 4,
  },
  {
    id: 7,
    user_id: 1,
    list_id: 5,
  },
  {
    id: 8,
    user_id: 1,
    list_id: 6,
  },
];

export async function up(sql) {
  await sql`
      INSERT INTO users_lists ${sql(usersLists, 'user_id', 'list_id')}
  `;
}

export async function down(sql) {
  for (const usersList of usersLists) {
    await sql`
      DELETE FROM
        users_lists
      WHERE
        id = ${usersList.id}
    `;
  }
}
