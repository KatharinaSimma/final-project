'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import {
  PlusIcon,
  ShareIcon,
  TrashIcon,
  WrenchIcon,
} from '@heroicons/react/20/solid';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import { Task } from '../../database/lists';
import { User } from '../../database/users';
import TaskContainer from '../components/TaskContainer';

export type ListWithTaskResponse = {
  id: number;
  title: string;
  sharedUsers: [User];
  tasks: [Task];
};

const getSingleListWithTask = gql`
  query SingleListWithTasks($singleListWithTasksId: ID!) {
    singleListWithTasks(id: $singleListWithTasksId) {
      id
      title
      description
      sharedUsers {
        id
        username
      }
      tasks {
        id
        title
        description
        done
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

const shareList = gql`
  mutation shareList($username: String!, $listId: ID!) {
    shareList(username: $username, listId: $listId) {
      userId
      listId
    }
  }
`;

type Props = { listsId: string; currentUser: string };

export default function SingleViewList(props: Props) {
  const [onError, setOnError] = useState('');
  const [onShareError, setOnShareError] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [username, setUsername] = useState('');
  const [showActions, setShowActions] = useState(false);

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

  const [handleShareList] = useMutation(shareList, {
    variables: {
      username: username,
      listId: props.listsId,
    },
    onError: (error) => {
      setOnShareError(error.message);
      setUsername('');
    },
    onCompleted: async () => {
      await refetch();
      setUsername('');
      setOnShareError('');
    },
  });

  const { loading, error, data, refetch } = useQuery(getSingleListWithTask, {
    variables: {
      singleListWithTasksId: props.listsId,
    },
    onCompleted: async () => {
      await refetch();
    },
    pollInterval: 1000,
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return <button className="btn loading ">loading</button>;
  }
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.singleListWithTasks) {
    redirect('/');
  }

  const numberOfAllTasks = data.singleListWithTasks.tasks.length;
  const numberOfDoneTasks = data.singleListWithTasks.tasks.filter(
    (task: Task) => task.done,
  ).length;
  const progress =
    numberOfAllTasks > 0
      ? ((numberOfDoneTasks / numberOfAllTasks) * 100).toFixed(0)
      : '0';
  const style = {
    '--value': progress,
    '--size': '3.3rem',
    '--thickness': '5px',
  } as React.CSSProperties;

  return (
    <main className="flex flex-col max-w-lg p-3 m-auto mb-12 sm:p-0">
      <div className="flex items-center justify-center gap-3">
        <h1 className="py-5 text-3xl text-center ">
          {data.singleListWithTasks.title}
        </h1>
        <div className="radial-progress text-primary" style={style}>
          {progress}%
        </div>
      </div>
      <p className="text-error min-h-8">{onError}</p>
      <div className="flex flex-wrap items-center gap-1 my-2 justify-items-center">
        <label className="p-2 text-lg text-primary" htmlFor="createTask">
          New Task:
        </label>
        <div className="flex flex-grow gap-1">
          <input
            className="w-full max-w-xs input input-bordered input-primary"
            id="createTask"
            placeholder="..."
            value={newTaskName}
            onChange={(event) => setNewTaskName(event.currentTarget.value)}
            onFocus={() => setOnError('')}
          />
          <button
            className="flex btn btn-outline btn-primary"
            onClick={async () => await handleCreateTask()}
          >
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <TaskContainer list={data.singleListWithTasks} />

      <div className="divider">
        <button
          className="flex items-center justify-center gap-2"
          onClick={() => {
            setShowActions(!showActions);
          }}
        >
          <WrenchIcon className="transition-all w-7 h-7 fill-primary hover:w-10 hover:h-10" />{' '}
          {showActions ? 'Hide' : 'Show'} list actions
        </button>
      </div>
      {showActions ? (
        <>
          <div className="flex flex-wrap items-center gap-1 my-2 justify-items-center">
            {data.singleListWithTasks.sharedUsers.length > 1 && (
              <ul className="w-full">
                You
                {data.singleListWithTasks.sharedUsers.map((user: User) => {
                  if (props.currentUser === user.username) {
                    return null;
                  }
                  return (
                    <span key={`shared-with-${user.id}`}>
                      {' '}
                      and{' '}
                      <strong className="text-primary-focus">
                        {user.username}{' '}
                      </strong>
                    </span>
                  );
                })}
                share this list.
              </ul>
            )}
            {onShareError ? <p className="text-error">{onShareError}</p> : null}
            <div className="flex flex-wrap items-center w-full gap-1 my-2 justify-items-center">
              <label className="p-2 text-lg text-primary " htmlFor="shareList">
                Share List:
              </label>
              <div className="flex flex-grow gap-1">
                <input
                  placeholder="enter username"
                  id="shareList"
                  className="w-full max-w-xs input input-bordered input-primary"
                  value={username}
                  onChange={(event) => setUsername(event.currentTarget.value)}
                />
                <button
                  className="flex btn btn-outline btn-primary"
                  onClick={async () => {
                    await handleShareList();
                  }}
                >
                  <ShareIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          <div className="w-full my-3">
            <button
              className="flex items-center gap-1 px-4 py-2 m-auto btn btn-error"
              onClick={async () => {
                await handleDeleteList({
                  variables: {
                    id: data.singleListWithTasks.id,
                  },
                });
              }}
            >
              <TrashIcon className="w-4 h-4" />
              Delete List
            </button>
          </div>
        </>
      ) : null}
    </main>
  );
}
