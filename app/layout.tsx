import './styles/globals.css';
import { gql } from '@apollo/client';
import { HeartIcon } from '@heroicons/react/20/solid';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { initializeApollo } from '../util/graphql';
import { themes } from '../util/themes';
import Navigation from './components/Navigation';

export const metadata = {
  title: {
    default: 'Taskology',
    template: '%s | Taskology',
  },
  manifest: '/manifest.json',
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout(props: Props) {
  const themeCookie = cookies().get('theme');
  const theme =
    themeCookie &&
    themes.find((themeName) => JSON.parse(themeCookie.value) === themeName)
      ? JSON.parse(themeCookie.value)
      : 'pastel';

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
    <Link
      href="/contact"
      className="flex justify-center gap-1 p-4"
      aria-label="Contact page"
    >
      <span className="align-middle flexjustify-center">
        Created by Katharina Simma with
      </span>
      <HeartIcon className="w-6 h-6 fill-primary hover:animate-spin" />
    </Link>
  );

  return (
    <html lang="en" className="max-w-full overflow-x-hidden" data-theme={theme}>
      <head />
      <body className="max-w-full overflow-x-hidden">
        <header className="hidden sm:block sm:p-5 sm:h-16">
          <Navigation
            isBottom={false}
            username={data.userBySessionToken?.username}
          />
        </header>
        {props.children}
        <footer className="btm-nav">
          <div className="hidden align-middle sm:block">{contactMessage}</div>

          <div className="block sm:hidden">
            <Navigation
              isBottom={true}
              username={data.userBySessionToken?.username}
            />
          </div>
        </footer>
      </body>
    </html>
  );
}
