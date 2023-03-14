'use client';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useState } from 'react';
import { ListWithTaskResponse } from './ListContainer';
import LocationButton from './LocationButton';
import TaskContainer from './TaskContainer';

type Props = {
  list: ListWithTaskResponse;
};

export default function ListComponent(props: Props) {
  const [listOpen, setListOpen] = useState(false);

  const { list } = props;

  return (
    <div className="max-w-lg p-2 mx-auto my-4 border border-solid rounded-md border-primary min-w-md">
      <div className="flex justify-between ">
        {list.title}
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
          <LocationButton location={list.title} />
          <Link href={`/${list.id}`}>
            <EllipsisVerticalIcon className="w-6 h-6" />
          </Link>
        </div>
      </div>

      <div
        className={`max-w-lg mx-auto my-4 rounded-md ${
          listOpen ? '' : 'hidden'
        } `}
      >
        <TaskContainer list={list} />
      </div>
    </div>
  );
}
