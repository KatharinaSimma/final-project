'use client';

import { gql, useMutation } from '@apollo/client';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Task } from '../database/lists';

type Props = { task: Task };

const deleteTaskMutation = gql`
  mutation deleteTask($id: ID!) {
    deleteTaskById(id: $id) {
      id
    }
  }
`;

export default function TaskComponent(props: Props) {
  const [taskOpen, setTaskOpen] = useState(false);
  const [onError, setOnError] = useState('');

  const { task } = props;

  console.log('task', task.id);

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
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="flex items-start justify-between gap-5 px-1 my-1 "
      key={`task-${task.id}`}
    >
      <div className="flex items-baseline gap-1">
        <input
          className="mx-1 accent-gray-400"
          id={`task-${task.id}`}
          type="checkbox"
        />
        <div>
          <label className="" htmlFor={`task-${task.id}`}>
            {task.title}
          </label>
          <div
            className={`max-w-lg mx-auto m-2 rounded-md border ${
              taskOpen ? '' : 'hidden'
            } `}
          >
            <p>{task.description}</p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={async () => {
            await handleDeleteTask({
              variables: {
                id: task.id,
              },
            });
          }}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <p className="error">{onError}</p>
        <button
          onClick={() => {
            setTaskOpen(!taskOpen);
          }}
        >
          {taskOpen ? (
            <ChevronUpIcon className="w-6 h-6" />
          ) : (
            <ChevronDownIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
