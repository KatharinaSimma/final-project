'use client';

import {
  ArchiveBoxArrowDownIcon,
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { useState } from 'react';
import { List } from '../../database/lists';
import TaskContainer from '../TaskContainer';

export type Task = {
  id: number;
  title: string;
  description: string;
};

type Props = {
  singleList: List;
};

// const deleteListMutation = gql`
//   mutation DeleteList($id: ID!) {
//     deleteListById(id: $id) {
//       id
//     }
//   }
// `;

export default function SingleViewList(props: Props) {
  const [description, setDescription] = useState(props.singleList.description);
  const [editDescription, setEditDescription] = useState(false);

  // const [handleDeleteAnimal] = useMutation(deleteAnimalMutation, {
  //   onError: (error) => {
  //     setOnError(error.message);
  //   },

  //   onCompleted: async () => {
  //     await refetch();
  //     setOnError('');
  //   },
  // });

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

      <TaskContainer listId={props.singleList.id} />
    </main>
  );
}
