'use client';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import Task from './Task';

type Props = {
  taskList: { id: number; title: string; description: string };
  tasks: { id: number; name: string; description: string }[];
};

export default function List(props: Props) {
  const [listOpen, setListOpen] = useState(false);

  return (
    <div
      className="max-w-lg p-2 mx-auto my-4 border border-gray-400 border-solid rounded-md min-w-md"
      key={`list_name_${props.taskList.title}`}
    >
      <div className="flex justify-between ">
        {props.taskList.title}
        <div className="flex gap-2 ">
          <button
            onClick={() => {
              setListOpen(!listOpen);
            }}
          >
            {listOpen ? (
              <ChevronUpIcon className="w-6 h-6" />
            ) : (
              <ChevronDownIcon className="w-6 h-6" />
            )}
          </button>
          <Link href={`/${props.taskList.id}`}>
            <EllipsisVerticalIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>

      <div
        className={`max-w-lg mx-auto my-4 rounded-md ${
          listOpen && props.taskList.description ? '' : 'hidden'
        } `}
      >
        {props.tasks.map((task) => {
          return (
            <div
              className="px-1 my-1 border rounded-md"
              key={`task-${task.id}`}
            >
              <Task task={task} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
