'use client';

import { gql, useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  formValidation,
  getSafeReturnToPath,
  Values,
} from '../../../util/validation';

const registerMutation = gql`
  mutation Register($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      id
      username
    }
  }
`;

export default function RegisterForm(props: { returnTo?: string | string[] }) {
  const [onError, setOnError] = useState('');
  const router = useRouter();

  const [registerUserHandler] = useMutation(registerMutation, {
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

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validate: formValidation,
    onSubmit: async (values: Values) => {
      await registerUserHandler({ variables: { ...values } });
    },
  });

  return (
    <div className="flex flex-col min-h-full pt-9">
      <div className="text-center">
        <h1 className="mx-auto text-3xl font-bold ">Register</h1>
        <p className="max-w-lg m-auto">Easy and free.</p>
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
                <p className="text-error" role="alert">
                  {formik.errors.username}
                </p>
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
                <p className="text-error" role="alert">
                  {formik.errors.password}
                </p>
              ) : null}
            </div>
            <p className="text-error min-h-8" role="alert">
              {onError}
            </p>
            <div className="mt-6 form-control">
              <button className="btn btn-primary">Register</button>
            </div>
          </form>
          <p className="mt-5">Already have an account?</p>
          <Link href="/login" className="btn btn-primary btn-outline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
