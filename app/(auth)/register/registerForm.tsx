'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../util/validation';

const registerMutation = gql`
  mutation Register($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      id
      username
    }
  }
`;

export default function RegisterForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [registerUserHandler] = useMutation(registerMutation, {
    variables: {
      username,
      password,
    },

    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      const returnTo = getSafeReturnToPath(props.returnTo);
      if (returnTo) {
        router.push(returnTo);
        return;
      }
      router.replace(`/profile`);
      router.refresh();
    },
  });

  return (
    <div>
      <h1>Register</h1>
      <div>
        <label>
          Username
          <input
            className="border rounded-md"
            value={username}
            onChange={(event) => {
              setUsername(event.currentTarget.value);
            }}
          />
        </label>
        <br />
        <label>
          Password
          <input
            className="border rounded-md"
            value={password}
            onChange={(event) => {
              setPassword(event.currentTarget.value);
            }}
          />
        </label>
        <button
          className="border rounded-md"
          onClick={async () => {
            await registerUserHandler();
          }}
        >
          Register
        </button>
      </div>
      <div className="error">{onError}</div>
    </div>
  );
}
