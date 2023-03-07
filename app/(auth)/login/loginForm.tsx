'use client';

import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../util/validation';

const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
    }
  }
`;

export default function LoginForm(props: { returnTo?: string | string[] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [loginHandler] = useMutation(loginMutation, {
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
      <h1>Login</h1>
      <div>
        <label>
          username
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
          password
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
            await loginHandler();
          }}
        >
          Login
        </button>
      </div>
      <div className="error">{onError}</div>
    </div>
  );
}
