'use client';

import {
  ArchiveBoxArrowDownIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import TaskBox from '../Task';

export type Task = {
  id: number;
  name: string;
  description: string;
};

type Props = {
  singleList: { id: number; title: string; description: string; tasks: Task[] };
};

export default function SingleViewList(props: Props) {
  const [description, setDescription] = useState(props.singleList.description);
  const [editDescription, setEditDescription] = useState(false);

  return (
    <main className="flex flex-col max-w-lg p-2 m-auto mb-12">
      <h1 className="py-5 text-3xl text-center ">
        Edit List: {props.singleList.title}
      </h1>
      <div className="flex justify-end gap-2 my-3">
        <button
          className="gap-1 px-3 py-1 border rounded-md "
          onClick={() => setEditDescription(!editDescription)}
        >
          {editDescription ? (
            <span className="flex items-center gap-1">
              <CheckCircleIcon className="w-4 h-4" /> Save Description
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <PencilIcon className="w-4 h-4" /> Edit Description
            </span>
          )}
        </button>
        <button className="flex items-center gap-1 px-3 py-1 border rounded-md">
          <ArchiveBoxArrowDownIcon className="w-4 h-4" />
          Archive
        </button>
        <button className="flex items-center gap-1 px-3 py-1 border rounded-md">
          <TrashIcon className="w-4 h-4" />
          Delete
        </button>
      </div>
      <div className="flex items-end justify-between">
        <label htmlFor="description">Description:</label>
      </div>

      {editDescription ? (
        <textarea
          rows={5}
          id="description"
          className="block w-full p-2 border rounded-md"
          value={description}
          onChange={(event) => {
            setDescription(event.currentTarget.value);
          }}
          placeholder="Add a description ..."
        />
      ) : (
        <span>{description}</span>
      )}

      <div className="">
        {props.singleList.tasks.map((task) => {
          return (
            <div className="my-1 border rounded-md" key={`task-${task.id}`}>
              <TaskBox task={task} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
