import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function LogoutPage() {
  const sessionToken = headers().get('x-fakeSessionToken-to-delete');

  if (sessionToken) {
    // FIXME: Delete session from `sessions` database table for real
    // console.log(sessionToken);
  }
  redirect('/');
}
