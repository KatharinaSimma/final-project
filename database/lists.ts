import { cache } from 'react';
import { sql } from './connect';

// ////// //
// TYPES  //
// ////// //

export type List = {
  id: number;
  title: string;
  description?: string;
};

export type Task = {
  id: number;
  listId?: number;
  title: string;
  done: boolean;
};

export type ListWithTasks = {
  id: number;
  listId: number | null;
  title: string;
  description: string | null;
  tasks: any;
};

// //// //
// READ //
// //// //

export const getLists = cache(async () => {
  const lists = await sql<{ id: number; title: string }[]>`
    SELECT
      id, title
    FROM
      lists
  `;
  return lists;
});

export const getListWithTask = cache(async (id: number) => {
  const tasks = await sql<
    { id: number; listId: number | null; title: string; done: boolean | null }[]
  >`
    SELECT
      id, list_id, title, done
    FROM
      tasks
    WHERE tasks.list_id = ${id}
  `;
  return tasks;
});

export const getTasks = cache(async () => {
  const tasks = await sql<
    { id: number; listId: number | null; title: string; done: boolean | null }[]
  >`
    SELECT
      id, list_id, title,  done
    FROM
      tasks
  `;

  return tasks;
});

export const getListById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [list] = await sql<{ id: number; title: string }[]>`
    SELECT
      id, title
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
    { id: number; listId: number | null; title: string; done: boolean | null }[]
  >`
    SELECT
      id, list_id, title, done
    FROM
      tasks
    WHERE
      list_id = ${listId}
  `;

  return task;
});

export const getListByTitle = cache(async (title: string) => {
  if (!title) {
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
        title = ${title}
  `;
  return list;
});

// ////// //
// CREATE //
// ////// //
export const createList = cache(async (title: string) => {
  const [list] = await sql<{ id: number; title: string }[]>`
    INSERT INTO lists
      (title)
    VALUES
      (${title})
    RETURNING
      id, title
  `;
  return list;
});

export const createUserListRelation = cache(
  async (userId: number, listId: number) => {
    const [list] = await sql<
      { id: number; userId: number | null; listId: number | null }[]
    >`
    INSERT INTO users_lists
      (user_id, list_id)
    VALUES
      (${userId}, ${listId} )
    RETURNING
      id, user_id, list_id
  `;
    return list;
  },
);

export const createTask = cache(async (title: string, listId: number) => {
  const [task] = await sql<
    { id: number; title: string; listId: number | null }[]
  >`
    INSERT INTO tasks
      (title, list_id)
    VALUES
      (${title}, ${listId})
    RETURNING
      id, title, list_id
  `;
  return task;
});

// /////// //
// UPDATE  //
// /////// //

export const updateTaskById = cache(
  async (id: number, title: string, done: boolean) => {
    if (Number.isNaN(id)) {
      return undefined;
    }

    const [task] = await sql<
      {
        id: number;
        listId: number | null;
        title: string;
        done: boolean | null;
        dueDate: Date | null;
        inUse: boolean | null;
        createdAt: Date | null;
      }[]
    >`
    UPDATE
      tasks
    SET
      title = ${title}, done = ${done}
    WHERE
      id = ${id}
    RETURNING *
  `;
    return task;
  },
);

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

// /////// //
// DELETE  //
// /////// //

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

export const deleteTaskById = cache(async (id: number) => {
  if (Number.isNaN(id)) {
    return undefined;
  }

  const [task] = await sql<
    {
      id: number;
      listId: number | null;
      title: string;
      done: boolean | null;
      dueDate: Date | null;
      inUse: boolean | null;
      createdAt: Date | null;
    }[]
  >`
    DELETE FROM
      tasks
    WHERE
      id = ${id}
    RETURNING *
  `;
  return task;
});
