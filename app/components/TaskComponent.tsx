'use client';

import { gql, useMutation } from '@apollo/client';
import { TrashIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Task } from '../../database/lists';

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

  if (loading) return <button className="btn loading">loading</button>;

  return (
    <div
      className="flex items-center justify-between gap-5 px-1 my-2 hover:border hover:border-primary hover:rounded-md"
      key={`task-${task.id}`}
    >
      <div className="flex items-baseline gap-1">
        <label className="flex gap-2 cursor-pointer label">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            onChange={async () => {
              setDone(!done);
              await handleUpdateTask();
            }}
            checked={done}
          />
          <span className="label-text">{task.title}</span>
        </label>
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
          <TrashIcon className="w-5 h-5 fill-secondary" />
        </button>
        <p className="error">{onError}</p>
      </div>
    </div>
  );
}
