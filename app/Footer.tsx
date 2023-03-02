import { HeartIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Navigation from './Navigation';

export default function Footer() {
  const contactMessage = (
    <Link href="/contact" className="flex justify-center gap-1">
      <span className="align-middle flexjustify-center">
        Created by Katharina Simma with
      </span>
      <HeartIcon className="w-6 h-6" />
    </Link>
  );

  return (
    <footer className="fixed bottom-0 w-full h-12 p-3 align-middle bg-white border-t">
      <div className="hidden sm:block">{contactMessage}</div>

      <div className="block sm:hidden">
        <Navigation />
      </div>
    </footer>
  );
}
