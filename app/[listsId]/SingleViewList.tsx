'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import {
  ArchiveBoxArrowDownIcon,
  CheckCircleIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Task } from '../../database/lists';
import TaskContainer from '../TaskContainer';

// import TaskContainer from '../TaskContainer';

export type ListWithTaskResponse = {
  id: number;
  title: string;
  description?: string;
  tasks: [Task];
};

const getSingleListWithTask = gql`
  query SingleListWithTasks($singleListWithTasksId: ID!) {
    singleListWithTasks(id: $singleListWithTasksId) {
      id
      title
      description
      tasks {
        id
        title
        description
      }
    }
  }
`;

const deleteListMutation = gql`
  mutation DeleteList($id: ID!) {
    deleteListById(id: $id) {
      id
    }
  }
`;

const createTask = gql`
  mutation createTask($title: String!, $listId: String!) {
    createTask(title: $title, listId: $listId) {
      id
      title
      listId
    }
  }
`;

type Props = { listsId: string };

export default function SingleViewList(props: Props) {
  const [description, setDescription] = useState('');
  const [editDescription, setEditDescription] = useState(false);
  const [onError, setOnError] = useState('');
  const [newTaskName, setNewTaskName] = useState('');

  const [handleDeleteList] = useMutation(deleteListMutation, {
    variables: {
      id: props.listsId,
    },

    onError: (err) => {
      setOnError(err.message);
    },

    onCompleted: async () => {
      await refetch();
      setOnError('');
    },
  });

  const [handleCreateTask] = useMutation(createTask, {
    variables: {
      title: newTaskName,
      listId: props.listsId,
    },
    onError: (error) => {
      setOnError(error.message);
    },
    onCompleted: async () => {
      await refetch();
      setNewTaskName('');
    },
  });

  const { loading, error, data, refetch } = useQuery(getSingleListWithTask, {
    variables: {
      singleListWithTasksId: props.listsId,
    },
    onCompleted: async () => {
      await refetch;
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="flex flex-col max-w-lg m-auto mb-12">
      <h1 className="py-5 text-3xl text-center ">
        Edit List: {data.singleListWithTasks.title}
      </h1>
      <p className="error">{onError}</p>

      <div className="flex justify-end gap-2 my-3">
        <button className="flex items-center gap-1 px-3 py-1 border rounded-md">
          <ArchiveBoxArrowDownIcon className="w-4 h-4" />
          Archive
        </button>

        <button
          className="flex items-center gap-1 px-3 py-1 border rounded-md"
          onClick={async () => {
            await handleDeleteList({
              variables: {
                id: data.singleListWithTasks.id,
              },
            });
          }}
        >
          <TrashIcon className="w-4 h-4" />
          Delete
        </button>
      </div>
      <div className="flex items-end justify-between">
        <label htmlFor="description">Description:</label>
        <button
          className="gap-1 px-3 py-1 border rounded-md "
          onClick={() => setEditDescription(!editDescription)}
        >
          {editDescription ? (
            <span className="flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" /> Save Description
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <PencilIcon className="w-4 h-4" /> Edit Description
            </span>
          )}
        </button>
      </div>

      {editDescription || !description ? (
        <textarea
          rows={3}
          id="description"
          className="block w-full p-2 border rounded-md"
          value={description}
          onChange={(event) => {
            setDescription(event.currentTarget.value);
          }}
          placeholder="Add a description ..."
        />
      ) : (
        <span>{description}</span>
      )}
      <div className="flex items-center gap-2 my-2 justify-items-center">
        <label className="p-2" htmlFor="createTask">
          New Task:
        </label>
        <input
          className="flex-grow p-2 border border-black rounded-md"
          id="createTask"
          placeholder="..."
          value={newTaskName}
          onChange={(event) => setNewTaskName(event.currentTarget.value)}
        />
        <button
          className="flex justify-center gap-1 p-2 border border-black border-solid rounded-md"
          onClick={async () => await handleCreateTask()}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>

      <TaskContainer list={data.singleListWithTasks} />
    </main>
  );
}
