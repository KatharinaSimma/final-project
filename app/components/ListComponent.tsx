'use client';

import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useState } from 'react';
import { Task } from '../../database/lists';
import { getLengthOfDoneTasks } from '../../util/dataStructures';
import { ListWithTaskResponse } from '../[listsId]/SingleViewList';
import LocationButton from './LocationButton';
import TaskContainer from './TaskContainer';

type Props = {
  list: ListWithTaskResponse;
  currentUser: string;
};

export default function ListComponent(props: Props) {
  const [listOpen, setListOpen] = useState(false);
  const { list } = props;
  const tasks: Task[] = list.tasks;
  const doneTasksLength = tasks.length > 0 ? getLengthOfDoneTasks(tasks) : '0';

  return (
    <div className="max-w-lg p-2 mx-auto my-4 border border-solid rounded-md border-primary min-w-md">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 ">
          {list.title}
          <button
            aria-label={
              listOpen ? `Close list ${list.title}` : `Open list ${list.title}`
            }
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
                  <div className="w-6 rounded-full bg-neutral-focus text-neutral-content hover:bg-primary">
                    <div className="tooltip" data-tip="hoi">
                      <span className="text-xs">{user.username.charAt(0)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <LocationButton location={list.title} />

          <div className="tooltip" data-tip="Edit list">
            <Link href={`/${list.id}`} aria-label="Edit list">
              <EllipsisVerticalIcon className="w-7 h-7 hover:fill-primary" />
            </Link>
          </div>
        </div>
      </div>
      {tasks.length > 0 ? (
        <progress
          className="w-full progress progress-primary"
          value={doneTasksLength}
          max={list.tasks.length}
        />
      ) : null}

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
