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
  icons: {
    shortcut: '/favicon.ico',
  },
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
    <Link href="/contact" className="flex justify-center gap-1">
      <span className="align-middle flexjustify-center">
        Created by Katharina Simma with
      </span>
      <HeartIcon className="w-6 h-6 fill-primary hover:animate-spin" />
    </Link>
  );

  return (
    <html lang="en" data-theme={theme}>
      <head />
      <body>
        <header className="hidden sm:block sm:p-5 sm:h-16">
          <Navigation username={data.userBySessionToken?.username} />
        </header>
        {props.children}
        <footer className="fixed bottom-0 w-full h-12 p-3 align-middle bg-base-100">
          <div className="hidden sm:block ">{contactMessage}</div>

          <div className="block sm:hidden">
            <Navigation username={data.userBySessionToken?.username} />
          </div>
        </footer>
      </body>
    </html>
  );
}
