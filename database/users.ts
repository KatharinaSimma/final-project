import { cache } from 'react';
import { sql } from './connect';

export type User = {
  id: number;
  username: string;
  passwordHash: string;
};

export const createUser = cache(
  async (username: string, passwordHash: string) => {
    const [user] = await sql<{ id: number; username: string }[]>`
      INSERT INTO users
        (username, password_hash)
      VALUES
        (${username}, ${passwordHash})
      RETURNING
        id, username
  `;
    return user;
  },
);

export const getUsers = cache(async () => {
  const user = await sql<{ id: number; username: string }[]>`
    SELECT
      id,
      username
    FROM
      users
  `;
  return user;
});

export const getListUserRelations = cache(async () => {
  const listIds = await sql<{ listId: number | null }[]>`
    SELECT
      list_id
    FROM
      users_lists
  `;
  return listIds;
});

export const createListUserRelations = cache(
  async (userId: number, listId: number) => {
    const [listUserRelation] = await sql<
      { userId: number | null; listId: number | null }[]
    >`
    INSERT INTO users_lists
      (user_id, list_id)
      VALUES
        (${userId}, ${listId})
      RETURNING
        user_id, list_id
  `;
    return listUserRelation;
  },
);

export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<{ id: number; username: string }[]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      username = ${username}
  `;
  return user;
});

export const getUserById = cache(async (id: number) => {
  const [user] = await sql<{ id: number; username: string }[]>`
    SELECT
      id,
      username
    FROM
      users
    WHERE
      id = ${id}
  `;
  return user;
});

export const getUserByUsernameWithPasswordHash = cache(
  async (username: string) => {
    const [user] = await sql<User[]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username}
  `;
    return user;
  },
);

export const getUserBySessionToken = cache(async (token: string) => {
  const [user] = await sql<{ id: number; username: string }[]>`
    SELECT
      users.id,
      users.username
    FROM
      users
    INNER JOIN
      sessions ON (
        sessions.token = ${token} AND
        sessions.user_id = users.id AND
        sessions.expiry_timestamp > now()
      )
  `;
  return user;
});

export const getUserWithList = cache(async (id: number) => {
  const userWithList = await sql<
    { id: number; title: string; description: string | null }[]
  >`
    SELECT
      lists.id AS id,
      lists.title AS title,
      lists.description AS description
    FROM
      users
    INNER JOIN
      users_lists ON users.id = users_lists.user_id
    INNER JOIN
      lists ON users_lists.list_id = lists.id
    WHERE
      users.id = ${id}

  `;
  return userWithList;
});

export const deleteUserById = cache(async (id: number) => {
  await sql`
    DELETE FROM
      users
    WHERE
      id = ${id}
  `;
});
