import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="flex justify-center gap-1 align-middle h-14">
      <span className="flex flex-col justify-center align-middle">
        Created by Katharina Simma with{' '}
      </span>
      <Image
        src="/icons/heart-outline.svg"
        width="20"
        height="20"
        alt="heart"
      />
    </footer>
  );
}
