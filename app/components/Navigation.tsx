import {
  EnvelopeIcon,
  InformationCircleIcon,
  RectangleGroupIcon,
  UserCircleIcon,
} from '@heroicons/react/20/solid';
import Link from 'next/link';

export default function Navigation(props: {
  username: string;
  isBottom: boolean;
}) {
  return (
    <nav
      className={`flex justify-around gap-7 sm:justify-center ${
        props.isBottom ? 'btm-nav' : ''
      }`}
    >
      <Link
        href="/"
        className="flex justify-center gap-1 align-middle"
        aria-label="Home"
      >
        <RectangleGroupIcon className="w-7 h-7" />
        <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
          Home
        </div>
      </Link>
      <Link
        href="/contact"
        className="flex justify-center gap-1 align-middle"
        aria-label="Contact"
      >
        <EnvelopeIcon className="w-7 h-7" />
        <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
          Contact
        </div>
      </Link>

      <Link
        href="/about"
        className="flex justify-center gap-1 align-middle"
        aria-label="About"
      >
        <InformationCircleIcon className="w-7 h-7" />
        <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
          About
        </div>
      </Link>

      {!props.username ? (
        <Link href="/login" className="flex" aria-label="Login">
          <UserCircleIcon className="w-7 h-7" />
          <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
            Login
          </div>
        </Link>
      ) : (
        <Link
          href="/profile"
          prefetch={false}
          className="flex gap-1"
          aria-label={`User profile ${props.username}`}
        >
          <div className="avatar placeholder">
            <div className="rounded-full w-7 bg-neutral-focus text-neutral-content">
              <span className="text-xs">{props.username.charAt(0)}</span>
            </div>
          </div>
          <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
            {props.username}
          </div>
        </Link>
      )}
    </nav>
  );
}
