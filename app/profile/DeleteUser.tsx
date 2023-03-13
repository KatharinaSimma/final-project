'use client';

import { gql, useMutation } from '@apollo/client';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

const deleteUserById = gql`
  mutation deleteUserById($id: ID!) {
    deleteUserById(id: $id) {
      id
    }
  }
`;

type Props = { userId: number };

export default function DeleteUser(props: Props) {
  const router = useRouter();
  if (!props.userId) {
    redirect('/logout');
  }

  const [onError, setOnError] = useState('');

  const [handleDeleteUser] = useMutation(deleteUserById, {
    variables: {
      id: props.userId,
    },

    onError: (err) => {
      setOnError(err.message);
    },

    onCompleted: () => {
      setOnError('');
      router.replace('/logout');
    },
  });

  return (
    <>
      <button
        className="btn btn-outline btn-error"
        onClick={() => handleDeleteUser()}
      >
        Delete Account
      </button>
      <p className="error">{onError}</p>
    </>
  );
}
