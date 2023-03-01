'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Task } from '../database/lists';

type Props = {
  task: Task;
};

export default function TaskComponent(props: Props) {
  const [taskOpen, setTaskOpen] = useState(false);

  const { task } = props;

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
