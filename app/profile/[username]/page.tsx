import { notFound } from 'next/navigation';
import { getUserByUsername } from '../../../database/users';

type Props = { params: { username: string } };

export default async function UserProfile({ params }: Props) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  return (
    <>
      <h1>Profile</h1>
      <h2>name: {user.username}</h2>
      <p>id: {user.id}</p>
    </>
  );
}
