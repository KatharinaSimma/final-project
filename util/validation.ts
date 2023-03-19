import { z } from 'zod';

const returnToSchema = z.string().refine((value) => {
  return !value.startsWith('/logout') && /^\/[\d#/=?a-z-]+$/.test(value);
});

export function getSafeReturnToPath(path: string | string[] | undefined) {
  const result = returnToSchema.safeParse(path);
  if (!result.success) return undefined;
  return result.data;
}

export interface Values {
  username: string;
  password: string;
}

export interface Errors {
  username?: string;
  password?: string;
}

export const formValidation = (values: Values) => {
  const errors: Errors = {};
  if (!values.username) {
    errors.username = 'Please provide a username';
  } else if (values.username.length > 50 || values.username.length < 4) {
    errors.username = 'Username must be between 3 and 50 characters long.';
  }

  if (!values.password) {
    errors.password = 'Please provide a password';
  } else if (
    !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(
      values.password,
    )
  ) {
    errors.password =
      'Password must be between 8 and 16 characters long and contain at least one number and one special character.';
  }
  return errors;
};
