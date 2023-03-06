import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ApolloClientProvider from '../../ApolloClientProvider';
import LoginForm from './loginForm';

type Props = { searchParams: { returnTo?: string | string[] } };

export default function LoginPage(props: Props) {
  const nextCookies = cookies();

  const fakeSessionToken = nextCookies.get('fakeSessionToken');

  if (fakeSessionToken?.value) {
    redirect('/');
  }

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <LoginForm returnTo={props.searchParams.returnTo} />
    </ApolloClientProvider>
  );
}
