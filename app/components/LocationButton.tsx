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
    <div className="tooltip" data-tip="Show Location in maps">
      <a
        className=""
        href={locationLink}
        rel="noreferrer noopener"
        target="_blank"
      >
        <MapPinIcon className="w-6 h-6 hover:fill-primary" />
      </a>
    </div>
  );
}
