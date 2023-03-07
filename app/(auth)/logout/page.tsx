import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteSessionByToken } from '../../../database/sessions';

export default async function LogoutPage() {
  const sessionToken = headers().get('x-sessionToken-to-delete');

  if (sessionToken) {
    await deleteSessionByToken(sessionToken);
  }

  redirect('/login');
}
