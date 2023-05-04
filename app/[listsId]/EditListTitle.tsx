'use client';

import { gql, useMutation } from '@apollo/client';
import { PencilIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { List } from '../../database/lists';

const updateListMutation = gql`
  mutation UpdateListkById($id: ID!, $title: String) {
    updateListById(id: $id, title: $title) {
      id
      title
    }
  }
`;

type Props = { list: List };

export default function EditLIstTitle(props: Props) {
  const [editTitle, setEditTitle] = useState(false);
  const [title, setTitle] = useState(props.list.title);
  const [onError, setOnError] = useState('');

  const [handleUpdateList] = useMutation(updateListMutation, {
    variables: {
      id: props.list.id,
      title: title,
    },

    onError: (error) => {
      setOnError(error.message);
      return;
    },

    onCompleted: () => {
      setOnError('');
    },

    refetchQueries: ['SingleListWithTasks'],
  });

  return (
    <div className="flex flex-wrap items-center w-full my-2 justify-items-center">
      <label className="p-1 text-lg text-primary" htmlFor="editListTitle">
        Edit List Name:
      </label>
      <div className="flex justify-end flex-grow gap-1">
        <input
          className="w-full input input-bordered input-primary"
          id="editListTitle"
          placeholder="..."
          value={title}
          onChange={(event) => {
            setTitle(event.currentTarget.value);
          }}
          onFocus={() => setOnError('')}
        />
        <button
          className="flex btn btn-outline btn-primary"
          aria-label={`Edit title for list ${props.list.title}`}
          onClick={async () => {
            setEditTitle(!editTitle);
            await handleUpdateList();
          }}
        >
          <PencilIcon className="w-6 h-6" />
        </button>
      </div>

      <p className="text-error min-h-8" role="alert">{onError}</p>
    </div>
  );
}
