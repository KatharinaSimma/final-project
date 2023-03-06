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

// Update animal
// export const updateUserById = cache(
//   async (id: number, username: string, password: string, accessory: string) => {
//     if (Number.isNaN(id)) {
//       return undefined;
//     }

//     const [animal] = await sql<User[]>`
//     UPDATE
//       users
//     SET
//       username = ${username},
//       password = ${password},
//       accessory = ${accessory}
//     WHERE
//       id = ${id}
//     RETURNING *
//   `;
//     return animal;
//   },
// );

// Detele animal
// export const deleteUserById = cache(async (id: number) => {
//   if (Number.isNaN(id)) {
//     return undefined;
//   }

//   const [animal] = await sql<User[]>`
//     DELETE FROM
//       users
//     WHERE
//       id = ${id}
//     RETURNING *
//   `;
//   return animal;
// });

export async function isUserAdminBySessionToken(sessionToken: string) {
  // FIXME: Implement proper authorization
  // console.log(sessionToken);
  return await true;
}
