'use client';

import { gql, useMutation } from '@apollo/client';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';
import { useState } from 'react';
import { ListWithTaskResponse } from './ListContainer';
import TaskContainer from './TaskContainer';

type Props = {
  list: ListWithTaskResponse;
};

const deleteListMutation = gql`
  mutation DeleteList($id: ID!) {
    deleteListById(id: $id) {
      id
    }
  }
`;

export default function ListComponent(props: Props) {
  const [listOpen, setListOpen] = useState(false);
  const [onError, setOnError] = useState('');

  const { list } = props;

  const [handleDeleteList, { loading }] = useMutation(deleteListMutation, {
    variables: {
      id: list.id,
    },
    onError: (err) => {
      setOnError(err.message);
    },
    onCompleted: () => {
      setOnError('');
    },
    refetchQueries: ['ListWithTask', 'SingleListWithTasks'],
  });

  if (loading) return <p>Loading...</p>;

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
        <p className="error">{onError}</p>
        <button
          className="flex items-center gap-1 px-2 py-1 border border-black rounded-md"
          onClick={async () => {
            await handleDeleteList({
              variables: {
                id: list.id,
              },
            });
          }}
        >
          <TrashIcon className="w-4 h-4" />
          Delete List
        </button>
      </div>
    </div>
  );
}
