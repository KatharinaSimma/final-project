'use client';

import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
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
    <div className="min-h-screen pt-9 bg-base-200">
      <div className="flex-col">
        <div className="text-center">
          <h1 className="mx-auto text-3xl font-bold">Register now!</h1>
          <p className="max-w-lg py-6 mx-auto">This app is awesome and free.</p>
        </div>
        <div className="flex-shrink-0 w-full max-w-md mx-auto shadow-2xl card bg-base-100">
          <div className="card-body">
            <div className="form-control">
              <label className="label" htmlFor="username">
                <span className="label-text">Username</span>
              </label>
              <input
                id="username"
                placeholder="username"
                className="input input-bordered"
                value={username}
                onChange={(event) => {
                  setUsername(event.currentTarget.value);
                }}
              />
            </div>
            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                id="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(event) => {
                  setPassword(event.currentTarget.value);
                }}
              />
              <Link
                href="/login"
                className="mt-5 label-text-alt link link-hover"
              >
                Already have an account?
              </Link>
            </div>
            <div className="error">{onError}</div>
            <div className="mt-6 form-control">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await registerUserHandler();
                }}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
