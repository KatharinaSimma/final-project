'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { List } from '../database/lists';
import ListComponent from './ListComponent';

const getLists = gql`
  query lists {
    lists {
      id
      title
      description
    }
  }
`;

const createList = gql`
  mutation createList($title: String!) {
    createList(title: $title) {
      id
      title
    }
  }
`;

export default function ListContainer() {
  const [newListName, setNewListName] = useState('');

  const { loading, error, data, refetch } = useQuery(getLists, {
    onCompleted: async () => {
      await refetch;
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // const [handleCreateList] = useMutation(createList, {
  //   variables: {
  //     title,
  //   },
  //   onError: (error) => {
  //     return;
  //   },
  // });

  return (
    <div className="max-w-lg mx-auto my-4 min-w-md">
      {data.lists.map((list: List) => {
        return <ListComponent list={list} key={`list_name_${list.id}`} />;
      })}
      <div className="flex items-center gap-2 justify-items-stretch">
        <label className="p-2" htmlFor="createList">
          New List:
        </label>
        <input
          className="flex-grow p-2 border border-black rounded-md"
          id="createList"
          placeholder="..."
          value={newListName}
          onChange={(event) => setNewListName(event.currentTarget.value)}
        />
        <button className="flex justify-center gap-2 p-2 border border-black border-solid rounded-md">
          <PlusIcon className="w-6 h-6" />
          Add New List
        </button>
      </div>
    </div>
  );
}
