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
import { calculateTaskProgress } from '../../util/dataStructures';
import TaskContainer from '../components/TaskContainer';
import EditLIstTitle from './EditListTitle';
import ListTitle from './ListTitle';

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
      sharedUsers {
        id
        username
      }
      tasks {
        id
        title
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

  const progress =
    data.singleListWithTasks.tasks.length > 0
      ? calculateTaskProgress(data.singleListWithTasks.tasks)
      : '0';

  return (
    <main className="flex flex-col max-w-lg p-3 m-auto mb-12 sm:p-0">
      <ListTitle
        list={data.singleListWithTasks}
        progress={progress}
        currentUser={props.currentUser}
      />
      {onError ? <p className="text-error min-h-8">{onError}</p> : null}
      <div className="flex flex-wrap items-center gap-1 my-2 justify-items-center">
        <label className="p-1 text-lg text-primary" htmlFor="createTask">
          New Task:
        </label>
        <div className="flex justify-end flex-grow gap-1">
          <input
            className="w-full input input-bordered input-primary"
            id="createTask"
            placeholder="..."
            value={newTaskName}
            onChange={(event) => setNewTaskName(event.currentTarget.value)}
            onFocus={() => setOnError('')}
          />
          <button
            className="flex btn btn-outline btn-primary"
            aria-label="Create new task"
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
          aria-label="Show list actions"
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
              <p className="w-full" role="status">
                You
                {data.singleListWithTasks.sharedUsers.map((user: User) => {
                  if (props.currentUser === user.username) {
                    return null;
                  }
                  return (
                    <span key={`shared-with-${user.id}`}>
                      {' '}
                      and{' '}
                      <strong className="p-1 m-1 border">
                        {user.username}{' '}
                      </strong>
                    </span>
                  );
                })}
                share this list.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center my-2 justify-items-center">
            <label className="p-1 text-lg text-primary" htmlFor="shareList">
              Share this List:
            </label>
            <div className="flex justify-end flex-grow gap-1">
              <input
                className="w-full input input-bordered input-primary"
                id="shareList"
                placeholder="enter a username"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
                onFocus={() => setOnShareError('')}
              />
              <button
                className="flex btn btn-outline btn-primary"
                aria-label={`Share list ${data.singleListWithTasks.title} with ${username}`}
                onClick={async () => {
                  await handleShareList();
                }}
              >
                <ShareIcon className="w-6 h-6" />
              </button>
            </div>
            {onShareError ? (
              <p className="m-3 text-error" role="status">
                {onShareError}
              </p>
            ) : null}
          </div>
          <EditLIstTitle list={data.singleListWithTasks} />
          <div className="w-full my-3">
            <button
              className="flex items-center gap-1 px-4 py-2 m-auto btn btn-error btn-outline"
              aria-label={`Delete list ${data.singleListWithTasks.title}`}
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
