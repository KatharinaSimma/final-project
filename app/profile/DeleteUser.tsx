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
  const [alert, setAlert] = useState(false);

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
      {!alert ? (
        <button
          className="btn btn-outline btn-error"
          onClick={() => setAlert(true)}
        >
          Delete Account
        </button>
      ) : null}
      <p className="error">{onError}</p>
      {alert ? (
        <div className="max-w-md m-auto shadow-lg alert">
          <div>
            <span className="pl-3 text-left">
              Are you sure? <br />
              This cannot be reverted!
            </span>
          </div>
          <div className="flex-none">
            <button
              className="btn btn-md btn-error"
              onClick={() => handleDeleteUser()}
            >
              Delete Account
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
