import { HeartIcon } from '@heroicons/react/20/solid';

export const metadata = {
  title: 'Contact',
  description: 'Contact Katharina Simma, she is a great developer!',
};

export default function Contact() {
  return (
    <main className="min-h-[calc(100vh-7rem)] mb-12 flex flex-col justify-center items-center">
      <h1 className="py-5 text-3xl text-center">Contact</h1>
      <p className="flex">
        {' '}
        <span className="flex flex-col justify-center align-middle">
          This page was created by Katharina Simma as the final project during
          the Upleveled Bootcamp Jan 9 - April 4.
        </span>
      </p>
      <br />
      <HeartIcon className="w-12 h-12" />
    </main>
  );
}
