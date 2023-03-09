import './globals.css';
import { getLocalStorage } from '../util/localStorage';
import Footer from './Footer';
import Header from './Header';

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
  const theme = getLocalStorage('theme');
  console.log(theme);
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
