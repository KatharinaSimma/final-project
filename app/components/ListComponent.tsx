'use client';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useState } from 'react';
import { Task } from '../../database/lists';
import { ListWithTaskResponse } from './ListContainer';
import LocationButton from './LocationButton';
import TaskContainer from './TaskContainer';

type Props = {
  list: ListWithTaskResponse;
  currentUser: string;
};

export default function ListComponent(props: Props) {
  const [listOpen, setListOpen] = useState(false);
  const { list } = props;
  const tasks = list.tasks.length;
  const dones = list.tasks.filter((task: Task) => task.done).length;

  return (
    <div className="max-w-lg p-2 mx-auto my-4 border border-solid rounded-md border-primary min-w-md">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 ">
          {list.title}
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
        </div>
        <div className="flex items-center gap-2">
          <div className="-space-x-3 avatar-group">
            {list.sharedUsers.map((user) => {
              if (props.currentUser === user.username) {
                return null;
              }
              return (
                <div
                  className="avatar placeholder"
                  key={`shared-with-${user.id}`}
                >
                  <div className="w-6 rounded-full bg-neutral-content text-base-100 hover:bg-primary">
                    <span className="text-xs">{user.username.charAt(0)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <LocationButton location={list.title} />
          <Link href={`/${list.id}`}>
            <EllipsisVerticalIcon className="w-7 h-7 hover:fill-primary" />
          </Link>
        </div>
      </div>
      <progress
        className="w-full progress progress-primary"
        value={dones}
        max={tasks}
      />

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
