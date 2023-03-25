'use client';

import { gql, useMutation } from '@apollo/client';
import { BookmarkIcon, PencilIcon } from '@heroicons/react/20/solid';
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

type Props = { list: List; progress: string };

export default function SingleViewList(props: Props) {
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

  const style = {
    '--value': props.progress,
    '--size': '3.3rem',
    '--thickness': '5px',
  } as React.CSSProperties;

  return (
    <div className="flex flex-col max-w-lg p-3 m-auto mb-12 sm:p-0">
      <div className="flex items-center justify-between gap-3 py-5">
        {editTitle ? (
          <label className="">
            <input
              className="text-2xl input input-bordered input-primary"
              value={title}
              onChange={(event) => {
                setTitle(event.currentTarget.value);
              }}
            />
          </label>
        ) : (
          <h1 className="text-3xl text-center border border-transparent ">
            {title}
          </h1>
        )}
        <div className="flex gap-2">
          {' '}
          {editTitle ? (
            <button
              onClick={async () => {
                setEditTitle(!editTitle);
                await handleUpdateList();
              }}
            >
              <div className="tooltip" data-tip="Save Changes">
                <BookmarkIcon className="w-7 h-7 hover:fill-primary" />
              </div>
            </button>
          ) : (
            <button onClick={() => setEditTitle(!editTitle)}>
              <div className="tooltip" data-tip="Edit">
                <PencilIcon className="w-7 h-7 hover:fill-primary" />
              </div>
            </button>
          )}
          {props.progress !== '0' ? (
            <div className="radial-progress text-primary" style={style}>
              {props.progress}%
            </div>
          ) : null}
        </div>
      </div>
      <p className="text-error min-h-8">{onError}</p>
    </div>
  );
}
