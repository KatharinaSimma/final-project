import { gql } from '@apollo/client';
import { CheckIcon, MapPinIcon, SparklesIcon } from '@heroicons/react/20/solid';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { initializeApollo } from '../../util/graphql';

export const metadata = {
  title: 'About',
  description:
    'Learn about Taskology, a great shareable list ab with a cool location feature!',
};

export default async function AboutPage() {
  const client = initializeApollo(null);
  const sessionToken = cookies().get('sessionToken');

  const { data } = await client.query({
    query: gql`
    query userBySessionToken($token: String! = "${sessionToken?.value}") {
      userBySessionToken(token: $token) {
        id
      }
    }
  `,
  });
  return (
    <main className="min-h-[calc(100vh-7rem)] mx-auto mb-12 p-5">
      <h1 className="py-5 text-3xl text-center">About Taskology</h1>

      <div className="flex flex-wrap items-center justify-center gap-12">
        {data &&
        data.userBySessionToken &&
        data.userBySessionToken.id ? null : (
          <div className="p-8 shadow-xl card">
            <div className="card-body">
              <h2 className="card-title">Be productive with Taskology</h2>
              <p>Making an account is easy and free.</p>
              <div className="mt-6 form-control">
                <Link href="/register" className="btn btn-primary btn-wide">
                  Register
                </Link>
                <Link
                  href="/login"
                  className="mt-5 label-text-alt link link-hover"
                >
                  Already have an account?
                </Link>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center mt-5">
          <CheckIcon className="w-12 h-12 fill-primary" />
          <p className="flex flex-col justify-center my-5 align-middle max-w-prose">
            Taskology is a nifty little app that lets you create task lists that
            you can share with friends. The main goal of the app is to provide
            the simplest list functionality without the overhead of a big todo
            or project management app.
          </p>

          <SparklesIcon className="w-12 h-12 fill-primary" />
          <p className="flex flex-col justify-center my-5 align-middle max-w-prose">
            The app lets you choose from a variety of themes depending on your
            needs or your mood.
          </p>

          <MapPinIcon className="w-12 h-12 fill-primary" />

          <p className="flex flex-col justify-center my-5 align-middle max-w-prose">
            The amazing feature that makes Taskology different from other list
            apps is a location feature. One click takes you directly to google
            maps. This is useful whether you share your billa shopping list or
            the list of favorite Pizza places in town
          </p>
        </div>
      </div>
    </main>
  );
}
