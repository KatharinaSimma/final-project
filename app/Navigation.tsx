import { gql } from '@apollo/client';
import {
  EnvelopeIcon,
  InformationCircleIcon,
  RectangleGroupIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { initializeApollo } from '../util/graphql';

export default async function Navigation() {
  const client = initializeApollo(null);
  const sessionToken = cookies().get('sessionToken');

  const { data } = await client.query({
    query: gql`
      query userBySessionToken($token: String! = "${sessionToken?.value}") {
        userBySessionToken(token: $token) {
          username
        }
      }
  `,
  });

  return (
    <nav className="flex justify-around gap-5 align-middle sm:justify-center ">
      <Link href="/" className="flex justify-center gap-1 align-middle">
        <RectangleGroupIcon className="w-6 h-6" />
        <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
          Home
        </div>
      </Link>
      <Link href="/contact" className="flex justify-center gap-1 align-middle">
        <EnvelopeIcon className="w-6 h-6" />
        <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
          Contact
        </div>
      </Link>

      <Link href="/about" className="flex justify-center gap-1 align-middle">
        <InformationCircleIcon className="w-6 h-6" />
        <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
          About
        </div>
      </Link>

      {!data.userBySessionToken ? (
        <Link href="/login" className="flex">
          <UserCircleIcon className="w-6 h-6" />
          <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
            Login
          </div>
        </Link>
      ) : (
        <Link href="/profile" prefetch={false} className="flex gap-1">
          <div className="avatar placeholder">
            <div className="w-6 rounded-full bg-primary text-neutral-content">
              <span className="text-xs">
                {data.userBySessionToken?.username.charAt(0)}
              </span>
            </div>
          </div>
          <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
            {data.userBySessionToken?.username}
          </div>
        </Link>
      )}
    </nav>
  );
}
