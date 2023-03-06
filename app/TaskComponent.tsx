'use client';

import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/20/solid';
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

const updateTaskMutation = gql`
  mutation UpdateTaskById($id: ID!, $title: String, $done: Boolean) {
    updateTaskById(id: $id, title: $title, done: $done) {
      id
      title
      description
      done
    }
  }
`;

export default function TaskComponent(props: Props) {
  const [onError, setOnError] = useState('');
  const [done, setDone] = useState(props.task.done);

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
      title: task.title,
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

  if (loading) return <p>Loading...</p>;

  return (
    <div
      className="flex items-start justify-between gap-5 px-1 my-2 "
      key={`task-${task.id}`}
    >
      <div className="flex items-baseline gap-1">
        <input
          className="mx-1 accent-gray-400"
          id={`task-${task.id}`}
          type="checkbox"
          onChange={async () => {
            setDone(!done);
            await handleUpdateTask();
          }}
          checked={done}
        />
        <div>
          <label className="" htmlFor={`task-${task.id}`}>
            {task.title}
          </label>
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
      </div>
    </div>
  );
}
