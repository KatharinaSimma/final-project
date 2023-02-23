import './globals.css';

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
        <header>TASKOLOGY</header>
        {props.children}
        <footer>Created by Katharina Simma with love</footer>
      </body>
    </html>
  );
}
