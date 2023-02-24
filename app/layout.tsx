import './globals.css';
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
  return (
    <html lang="en">
      <head />
      <body>
        <Header />
        {props.children}
        <Footer />
      </body>
    </html>
  );
}
