import { cache } from 'react';
import { sql } from './connect';

export type List = {
  id: number;
  title: string;
  description?: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
};

export const getLists = cache(async () => {
  const lists = await sql<List[]>`
    SELECT
      id, title, description
    FROM
      lists
  `;

  return lists;
});

export const getTasks = cache(async () => {
  const tasks = await sql<Task[]>`
    SELECT
      *
    FROM
      tasks
  `;

  return tasks;
});

export const getListById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [list] = await sql<List[]>`
    SELECT
      *
    FROM
      lists
    WHERE
      id = ${id}
  `;

  return list;
});

export const getTaskByListId = cache(async (listId: number) => {
  if (Number.isNaN(listId)) {
    return undefined;
  }

  const task = await sql<Task[]>`
    SELECT
      *
    FROM
      tasks
    WHERE
      list_id = ${listId}
  `;

  return task;
});

// Create list
export const createList = cache(async (title: string, description: string) => {
  const [list] = await sql<List[]>`
    INSERT INTO lists
      (title, description)
    VALUES
      (${title}, ${description})
    RETURNING *
  `;
  return list;
});

// Update list
// export const updateListById = cache(
//   async (id: number, title: string, description: string) => {
//     if (Number.isNaN(id)) {
//       return undefined;
//     }

//     const [list] = await sql<List[]>`
//     UPDATE
//       lists
//     SET
//       title = ${title},
//       description = ${description}
//     WHERE
//       id = ${id}
//     RETURNING *
//   `;
//     return list;
//   },
// );

// Detele list
// export const deleteListById = cache(async (id: number) => {
//   if (Number.isNaN(id)) {
//     return undefined;
//   }

//   const [list] = await sql<List[]>`
//     DELETE FROM
//       lists
//     WHERE
//       id = ${id}
//     RETURNING *
//   `;
//   return list;
// });

// Get list by first name
// export const getListByTitle = cache(async (title: string) => {
//   if (!title) {
//     return undefined;
//   }

//   const [list] = await sql<List[]>`
//       SELECT
//         *
//       FROM
//         lists
//       WHERE
//         title = ${title}
//   `;
//   return list;
// });
