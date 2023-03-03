'use client';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useState } from 'react';
import { ListWithTaskResponse } from './ListContainer';
import TaskContainer from './TaskContainer';

type Props = {
  list: ListWithTaskResponse;
};

export default function ListComponent(props: Props) {
  const [listOpen, setListOpen] = useState(false);

  return (
    <div className="max-w-lg p-2 mx-auto my-4 border border-gray-400 border-solid rounded-md min-w-md">
      <div className="flex justify-between ">
        {props.list.title}
        <div className="flex gap-2 ">
          {props.list.tasks.length < 1 ? (
            <Link href={`/${props.list.id}`}>
              <PlusIcon className="w-6 h-6" />
            </Link>
          ) : (
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
          )}
          <Link href={`/${props.list.id}`}>
            <EllipsisVerticalIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>

      <div
        className={`max-w-lg mx-auto my-4 rounded-md ${
          listOpen ? '' : 'hidden'
        } `}
      >
        {' '}
        {props.list.description}
        <TaskContainer list={props.list} />
      </div>
    </div>
  );
}
