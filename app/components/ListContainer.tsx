'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { Task } from '../../database/lists';
import { User } from '../../database/users';
import ListComponent from './ListComponent';

export type ListWithTaskResponse = {
  id: number;
  title: string;
  description?: string;
  sharedUsers: [User];
  tasks: [Task];
};

const getListWithTask = gql`
  query ListWithTasks {
    listWithTasks {
      id
      title
      description
      sharedUsers {
        id
        username
      }
      tasks {
        id
        title
        description
        done
      }
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

type Props = {
  currentUser: string;
};

export default function ListContainer(props: Props) {
  const [newListName, setNewListName] = useState('');
  const [onError, setOnError] = useState('');

  const [handleCreateList] = useMutation(createList, {
    variables: {
      title: newListName,
    },
    onError: (error) => {
      setOnError(error.message);
    },
    onCompleted: async () => {
      await refetch();
      setNewListName('');
    },
  });

  const { loading, error, data, refetch } = useQuery(getListWithTask, {
    onCompleted: async () => {
      await refetch();
    },
    // pollInterval: 1000,
    // fetchPolicy: 'network-only',
  });

  if (loading) return <button className="btn loading">loading</button>;
  if (error) return <p>Error: {error.message}</p>;

  const reversedListWithTasks = [...data.listWithTasks].reverse();

  return (
    <div className="max-w-lg mx-auto my-4 min-w-md">
      <p className="error">{onError}</p>
      <div className="flex flex-wrap items-center gap-2 justify-items-stretch">
        <label className="p-2" htmlFor="createList">
          New List:
        </label>
        <input
          className="flex-grow p-2 border rounded-md "
          id="createList"
          placeholder="..."
          value={newListName}
          onChange={(event) => setNewListName(event.currentTarget.value)}
        />
        <button
          className="flex justify-center gap-2 p-2 border border-black border-solid rounded-md"
          onClick={async () => await handleCreateList()}
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      </div>
      {reversedListWithTasks.map((list: ListWithTaskResponse) => {
        return (
          <ListComponent
            list={list}
            key={`list_name_${list.id}`}
            currentUser={props.currentUser}
          />
        );
      })}
    </div>
  );
}
