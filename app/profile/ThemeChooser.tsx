'use client';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setStringifiedCookie } from '../../util/cookies';
import { themes } from '../../util/themes';

export default function ThemeChooser() {
  const [listOpen, setListOpen] = useState(false);
  const router = useRouter();
  return (
    <div className="mt-10">
      <button
        className="px-5 py-3 mx-auto my-4 bg-base-100 min-w-sm max-w-fit mp-2 btn btn-outline btn-primary min-w-md"
        onClick={() => {
          setListOpen(!listOpen);
        }}
      >
        <div className="flex items-center justify-between">
          Choose a theme
          <div className="flex gap-2 ">
            {listOpen ? (
              <ChevronUpIcon className="w-6 h-6" />
            ) : (
              <ChevronDownIcon className="w-6 h-6" />
            )}
          </div>
        </div>
      </button>
      <div
        className={`max-w-4xl mx-auto my-4 h-fit grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 ${
          listOpen ? '' : 'hidden'
        } `}
      >
        {themes.map((theme) => {
          return (
            <button
              key={`theme-${theme}`}
              className="overflow-hidden text-left rounded-lg hover:outline foucs:outline"
              data-set-theme={theme}
              data-act-class="[&amp;_svg]:visible"
              aria-label={`Set theme color ${theme}`}
              onClick={() => {
                setStringifiedCookie('theme', theme);
                setListOpen(false);
                router.refresh();
              }}
            >
              <div
                data-theme={theme}
                className="w-full font-sans cursor-pointer bg-base-100 text-base-content"
              >
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="flex items-center col-span-5 row-span-3 row-start-1 gap-2 px-4 py-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="invisible w-3 h-3"
                    >
                      <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
                    </svg>{' '}
                    <div className="flex-grow text-sm font-bold">{theme}</div>{' '}
                    <div className="flex flex-wrap flex-shrink-0 h-full gap-1">
                      <div className="w-2 rounded bg-primary" />
                      <div className="w-2 rounded bg-secondary" />
                      <div className="w-2 rounded bg-accent" />
                      <div className="w-2 rounded bg-neutral" />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
