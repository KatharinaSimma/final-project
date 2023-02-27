'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type Props = {
  task: { id: number; name: string; description: string };
};

export default function SingleList(props: Props) {
  const [taskOpen, setTaskOpen] = useState(false);

  return (
    <div
      className="flex items-start justify-between gap-5 px-1 my-1 "
      key={`task-${props.task.id}`}
    >
      <div className="flex items-baseline gap-1">
        <input
          className="mx-1 accent-gray-400"
          id={`task-${props.task.id}`}
          type="checkbox"
        />
        <div>
          <label className="" htmlFor={`task-${props.task.id}`}>
            {props.task.name}
          </label>
          <div
            className={`max-w-lg mx-auto m-2 rounded-md border ${
              taskOpen ? '' : 'hidden'
            } `}
          >
            <p>This task is open!</p>
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
