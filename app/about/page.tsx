import { HeartIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export const metadata = {
  title: 'About',
  description: 'Learn about Katharina Simma, a great developer!',
};

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-7rem)] mb-12 flex flex-col justify-center items-center">
      <h1 className="py-5 text-3xl text-center">About</h1>
      <p className="flex flex-col justify-center align-middle">
        This app is awesome! You can create Lists with Tasks and then you do the
        task and tick the task off and it disappears. How cool is that?
      </p>
      <br />
      <HeartIcon className="w-12 h-12" />

      <h2>Start being productive with Taskology and login now!</h2>
      <div className="mt-6 form-control">
        <Link href="/login" className="btn btn-primary btn-wide">
          Login
        </Link>
      </div>
    </main>
  );
}
