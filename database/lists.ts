import { cache } from 'react';
import { sql } from './connect';

export type List = {
  id: number;
  title: string;
  description?: string;
};

export type Task = {
  id: number;
  listId?: number;
  title: string;
  description?: string;
};

export const getLists = cache(async () => {
  const lists = await sql<
    { id: number; title: string; description: string | null }[]
  >`
    SELECT
      id, title, description
    FROM
      lists
  `;

  return lists;
});

export type ListWithTasks = {
  id: number;
  listId: number | null;
  title: string;
  description: string | null;
  dueDate: Date | null;
  inUse: boolean | null;
  createdAt: Date | null;
};

export const getListWithTask = cache(async (id: number) => {
  const tasks = await sql<ListWithTasks[]>`
    SELECT
      *
    FROM
      tasks
    WHERE tasks.list_id = ${id}
  `;
  return tasks;
});

export const getTasks = cache(async () => {
  const tasks = await sql<
    {
      id: number;
      listId: number | null;
      title: string;
      description: string | null;
    }[]
  >`
    SELECT
      id, list_id, title, description
    FROM
      tasks
  `;

  return tasks;
});

export const getListById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [list] = await sql<
    {
      id: number;
      title: string;
      description: string | null;
      createdAt: Date | null;
    }[]
  >`
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

  const task = await sql<
    {
      id: number;
      listId: number | null;
      title: string;
      description: string | null;
    }[]
  >`
    SELECT
      id, list_id, title, description
    FROM
      tasks
    WHERE
      list_id = ${listId}
  `;

  return task;
});

// Create list
export const createList = cache(async (title: string) => {
  const [list] = await sql<
    { id: number; title: string; description: string | null }[]
  >`
    INSERT INTO lists
      (title)
    VALUES
      (${title})
    RETURNING
      id, title, description
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
export const deleteListById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [list] = await sql<
    {
      id: number;
      title: string;
      description: string | null;
      createdAt: Date | null;
    }[]
  >`
    DELETE FROM
      lists
    WHERE
      id = ${id}
    RETURNING *
  `;
  return list;
});

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
