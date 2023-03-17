'use client';

import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
    }
  }
`;

export default function LoginForm() {
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
      router.replace(`/`);
      router.refresh();
    },
  });

  return (
    <div>
      <div className="min-h-screen pt-9 bg-base-200">
        <div className="flex-col">
          <div className="text-center">
            <h1 className="mx-auto text-3xl font-bold">Login now!</h1>
          </div>
          <div className="flex-shrink-0 w-full max-w-md mx-auto shadow-2xl card bg-base-100">
            <div className="card-body">
              <form autoComplete="on">
                <div className="form-control">
                  <label className="label" htmlFor="username">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    id="username"
                    placeholder="username"
                    autoComplete="username"
                    className="input input-bordered"
                    value={username}
                    required
                    minLength={3}
                    maxLength={49}
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
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="password"
                    className="input input-bordered"
                    minLength={8}
                    maxLength={16}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                    }}
                  />
                  <Link
                    href="/register"
                    className="mt-5 label-text-alt link link-hover"
                  >
                    Don't have an account?
                  </Link>
                </div>
                <p className="text-error min-h-8">{onError}</p>
                <div className="mt-6 form-control">
                  <button
                    className="btn btn-primary"
                    onClick={async (event) => {
                      event.preventDefault();
                      await loginHandler();
                    }}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
