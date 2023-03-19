'use client';

import { CheckIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Task } from '../../database/lists';
import { ListWithTaskResponse } from './ListContainer';
import TaskComponent from './TaskComponent';

type Props = {
  list: ListWithTaskResponse;
};

export default function TaskContainer(props: Props) {
  const { list } = props;
  const [showDone, setShowDone] = useState(false);

  return (
    <div>
      {list.tasks.map((task: Task) => (
        <div key={`task-${task.id}`}>
          {!task.done && <TaskComponent task={task} />}
        </div>
      ))}
      <div className="divider">
        <button
          className="flex items-center justify-center gap-2"
          onClick={() => {
            setShowDone(!showDone);
          }}
        >
          <CheckIcon className="w-8 h-8 transition-all fill-primary hover:w-10 hover:h-10" />{' '}
          Show done items
        </button>
      </div>
      {showDone
        ? list.tasks.map((task: Task) => (
            <div key={`task-${task.id}`}>
              {task.done && <TaskComponent task={task} />}
            </div>
          ))
        : null}
    </div>
  );
}
