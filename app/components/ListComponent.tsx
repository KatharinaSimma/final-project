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
  currentUser: string;
};

export default function ListComponent(props: Props) {
  const [listOpen, setListOpen] = useState(false);

  const { list } = props;

  return (
    <div className="max-w-lg p-2 mx-auto my-4 border border-solid rounded-md border-primary min-w-md">
      <div className="flex justify-between">
        {list.title}
        <div className="flex items-center gap-2 ">
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
                  <div className="w-6 rounded-full bg-neutral-focus text-neutral-content">
                    <span className="text-xs">
                      <span className="text-xs">{user.username.charAt(0)}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
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
