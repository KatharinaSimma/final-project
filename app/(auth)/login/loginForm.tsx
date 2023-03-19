'use client';

import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formValidation, Values } from '../../../util/validation';

const loginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
    }
  }
`;

export default function LoginForm() {
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [loginHandler] = useMutation(loginMutation, {
    onError: (error) => {
      setOnError(error.message);
    },

    onCompleted: () => {
      router.replace(`/`);
      router.refresh();
    },
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: formValidation,
    onSubmit: async (values: Values) => {
      await loginHandler({ variables: { ...values } });
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
              <form onSubmit={formik.handleSubmit} noValidate>
                <div className="form-control">
                  <label className="label" htmlFor="username">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    id="username"
                    name="username"
                    placeholder="username"
                    className={`input input-bordered ${
                      formik.errors.username ? 'border-error' : ''
                    }`}
                    autoComplete="username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <p className="text-error">{formik.errors.username}</p>
                  ) : null}
                </div>
                <div className="form-control">
                  <label className="label" htmlFor="password">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="password"
                    className={`input input-bordered ${
                      formik.errors.password ? 'border-error' : ''
                    }`}
                    autoComplete="current-password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <p className="text-error">{formik.errors.password}</p>
                  ) : null}
                </div>
                <Link
                  href="/register"
                  className="mt-5 label-text-alt link link-hover"
                >
                  Don't have an account?
                </Link>
                <p className="text-error min-h-8">{onError}</p>
                <div className="mt-6 form-control">
                  <button className="btn btn-primary">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
