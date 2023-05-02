'use client';

import { gql, useMutation } from '@apollo/client';
import { BookmarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Task } from '../../database/lists';
import LocationButton from './LocationButton';

type Props = { task: Task };

const deleteTaskMutation = gql`
  mutation deleteTask($id: ID!) {
    deleteTaskById(id: $id) {
      id
    }
  }
`;

const updateTaskMutation = gql`
  mutation UpdateTaskById($id: ID!, $title: String, $done: Boolean) {
    updateTaskById(id: $id, title: $title, done: $done) {
      id
      title
      done
    }
  }
`;

export default function TaskComponent(props: Props) {
  const [onError, setOnError] = useState('');
  const [done, setDone] = useState(props.task.done);
  const [title, setTitle] = useState(props.task.title);
  const [editTitle, setEditTitle] = useState(false);
  const { task } = props;

  const [handleDeleteTask, { loading }] = useMutation(deleteTaskMutation, {
    variables: {
      id: task.id,
    },
    onError: (error) => {
      setOnError(error.message);
    },
    onCompleted: () => {
      setOnError('');
    },
    refetchQueries: ['ListWithTasks', 'SingleListWithTasks'],
  });

  const [handleUpdateTask] = useMutation(updateTaskMutation, {
    variables: {
      id: task.id,
      title: title,
      done: !done,
    },

    onError: (error) => {
      setOnError(error.message);
      return;
    },

    onCompleted: () => {
      setOnError('');
    },

    refetchQueries: ['ListWithTask', 'SingleListWithTasks'],
  });

  if (loading) return <button className="btn loading">loading</button>;

  return (
    <div
      className="flex items-center justify-between gap-5 my-2"
      key={`task-${task.id}`}
    >
      <div
        className={`flex items-center border border-transparent  ${
          !editTitle
            ? 'p-l hover:border hover:border-primary hover:rounded-md'
            : ''
        }`}
      >
        <input
          type="checkbox"
          id={`task-title-${task.id}`}
          className="mx-2 checkbox checkbox-primary"
          checked={done}
          onKeyUp={async (event) => {
            if (event.key === 'Enter') {
              setDone(!done);
              await handleUpdateTask({
                variables: {
                  id: task.id,
                  title: title,
                  done: !done,
                },
              });
            }
          }}
          onChange={async () => {
            setDone(!done);
            await handleUpdateTask({
              variables: {
                id: task.id,
                title: title,
                done: !done,
              },
            });
          }}
        />

        {editTitle ? (
          <input
            className="input input-bordered input-primary h-fit"
            value={title}
            onChange={(event) => {
              setTitle(event.currentTarget.value);
            }}
          />
        ) : (
          <label
            className="flex gap-2 cursor-pointer label"
            htmlFor={`task-title-${task.id}`}
          >
            {title}
          </label>
        )}
      </div>

      <div className="flex flex-row items-center justify-between">
        {editTitle ? (
          <button
            className="flex justify-center p-1 border border-transparent sm:p-3 tooltip hover:border hover:border-primary hover:rounded-md"
            aria-label={`Save task ${task.title}`}
            onClick={async () => {
              setEditTitle(!editTitle);
              await handleUpdateTask({
                variables: {
                  id: task.id,
                  title: title,
                  done: done,
                },
              });
            }}
          >
            <div className="tooltip" data-tip="Save Changes">
              <BookmarkIcon className="w-5 h-5 hover:fill-primary" />
            </div>
          </button>
        ) : (
          <button
            className="flex justify-center p-1 border border-transparent sm:p-3 tooltip hover:border hover:border-primary hover:rounded-md"
            onClick={() => setEditTitle(!editTitle)}
            aria-label={`Edit task ${task.title}`}
          >
            <div className="tooltip" data-tip="Edit">
              <PencilIcon className="w-5 h-5 hover:fill-primary" />
            </div>
          </button>
        )}
        <LocationButton location={task.title} />
        <button
          className="flex justify-center p-1 border border-transparent sm:p-3 hover:border hover:border-primary hover:rounded-md"
          aria-label={`Delete task ${task.title}`}
          onClick={async () => {
            await handleDeleteTask({
              variables: {
                id: task.id,
              },
            });
          }}
        >
          <div className="tooltip" data-tip="Delete Task">
            <TrashIcon className="w-5 h-5 hover:fill-error" />
          </div>
        </button>
        <p className="error">{onError}</p>
      </div>
    </div>
  );
}
