const users = [
  {
    id: 1,
    username: 'Kathi',
    password_hash:
      '$2b$12$pVtSH.5mU1zmzaCY8LwMn.8JkVrFXKGFx0GxGQPMsT0kWzi/aZi0e',
  },
  {
    id: 2,
    username: 'Jackie',
    password_hash:
      '$2b$12$pVtSH.5mU1zmzaCY8LwMn.8JkVrFXKGFx0GxGQPMsT0kWzi/aZi0e',
  },
];

export async function up(sql) {
  await sql`
      INSERT INTO users ${sql(users, 'username', 'password_hash')}
  `;
}

export async function down(sql) {
  for (const list of users) {
    await sql`
      DELETE FROM
        users
      WHERE
        id = ${list.id}
    `;
  }
}
