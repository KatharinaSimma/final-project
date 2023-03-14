import { gql } from '@apollo/client';
import { HeartIcon } from '@heroicons/react/20/solid';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { initializeApollo } from '../../util/graphql';
import Navigation from './Navigation';

export default async function Footer() {
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

  const contactMessage = (
    <Link href="/contact" className="flex justify-center gap-1">
      <span className="align-middle flexjustify-center">
        Created by Katharina Simma with
      </span>
      <HeartIcon className="w-6 h-6 fill-primary" />
    </Link>
  );

  return (
    <footer className="fixed bottom-0 w-full h-12 p-3 align-middle bg-base-100">
      <div className="hidden sm:block ">{contactMessage}</div>

      <div className="block sm:hidden">
        <Navigation username={data.userBySessionToken?.username} />
      </div>
    </footer>
  );
}
