'use client';

import { MapPinIcon } from '@heroicons/react/20/solid';

type Props = {
  location: string;
};

export default function LocationButton(props: Props) {
  const locationLink = encodeURI(
    `https://www.google.com/maps/search/?api=1&query=${props.location}`,
  );

  return (
    <div
      className="p-1 border border-transparent sm:p-3 tooltip hover:border hover:border-primary hover:rounded-md"
      data-tip="Show Location in maps"
    >
      <a
        href={locationLink}
        rel="noreferrer noopener"
        target="_blank"
        aria-label={`Show location for ${props.location} on google maps`}
      >
        <MapPinIcon className="w-6 h-6 hover:fill-primary" />
      </a>
    </div>
  );
}
