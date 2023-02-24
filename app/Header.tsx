import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const iconSize = '25';

  return (
    <header className="p-5 h-14">
      <nav className="flex justify-around gap-5 align-middle md:justify-center">
        <Link href="/" className="flex justify-center gap-1 align-middle">
          <Image
            className=""
            src="/icons/dashboard-outline.svg"
            alt="home"
            width={iconSize}
            height={iconSize}
          />
          <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
            Dashboard
          </div>
        </Link>
        <Link href="/" className="flex justify-center gap-1 align-middle">
          <Image
            className=""
            src="/icons/contact-outline.svg"
            alt="contact"
            width={iconSize}
            height={iconSize}
          />
          <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
            Contact
          </div>
        </Link>
        <Link href="/" className="flex justify-center gap-1 align-middle">
          <Image
            className=""
            src="/icons/search-outline.svg"
            alt="search"
            width={iconSize}
            height={iconSize}
          />
          <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
            Search
          </div>
        </Link>
        <Link href="/" className="flex">
          <Image
            className=""
            src="/icons/user-outline.svg"
            alt="user"
            width={iconSize}
            height={iconSize}
          />
          <div className="hidden sm:flex-col sm:justify-center sm:align-middle sm:flex">
            Profile
          </div>
        </Link>
      </nav>
    </header>
  );
}
