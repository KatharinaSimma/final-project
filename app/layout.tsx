import './styles/globals.css';
import { cookies } from 'next/headers';
import { themes } from '../util/themes';
import Footer from './components/Footer';
import Header from './components/Header';

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

export default function RootLayout(props: Props) {
  const themeCookie = cookies().get('theme');

  const theme =
    themeCookie &&
    themes.find((themeName) => JSON.parse(themeCookie.value) === themeName)
      ? JSON.parse(themeCookie.value)
      : 'light';

  return (
    <html lang="en" data-theme={theme}>
      <head />
      <body>
        <Header />
        {props.children}
        <Footer />
      </body>
    </html>
  );
}
