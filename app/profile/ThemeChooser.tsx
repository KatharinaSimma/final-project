'use client';
// import { useRouter } from 'next/router';
import { setLocalStorage } from '../../util/localStorage';

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];

export default function ListsPage() {
  // const router = useRouter();
  return (
    <div className="mt-10">
      <h2>Choose your favorite theme</h2>
      <div className="grid max-w-4xl grid-cols-5 gap-2 mx-auto">
        {themes.map((theme) => {
          return (
            <button
              onClick={() => {
                setLocalStorage('theme', { theme });
                // router.reload();
              }}
              key={`theme-${theme}`}
              className="overflow-hidden border rounded-lg w-sm border-base-content/20 hover:border-base-content/40 outline-base-content outline-2 outline-offset-2"
              data-set-theme={theme}
              data-act-class="outline"
            >
              <div
                data-theme={theme}
                className="w-full font-sans cursor-pointer bg-base-100 text-base-content"
              >
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="col-start-1 row-span-2 row-start-1 bg-base-200" />
                  <div className="col-start-1 row-start-3 bg-base-300" />
                  <div className="flex flex-col col-span-4 col-start-2 row-span-3 row-start-1 gap-1 p-2 bg-base-100">
                    <div className="font-bold">{theme}</div>{' '}
                    <div className="flex flex-wrap gap-1">
                      <div className="flex items-center justify-center w-5 rounded bg-primary aspect-square lg:w-6">
                        <div className="text-sm font-bold text-primary-content">
                          A
                        </div>
                      </div>{' '}
                      <div className="flex items-center justify-center w-5 rounded bg-secondary aspect-square lg:w-6">
                        <div className="text-sm font-bold text-secondary-content">
                          A
                        </div>
                      </div>{' '}
                      <div className="flex items-center justify-center w-5 rounded bg-accent aspect-square lg:w-6">
                        <div className="text-sm font-bold text-accent-content">
                          A
                        </div>
                      </div>{' '}
                      <div className="flex items-center justify-center w-5 rounded bg-neutral aspect-square lg:w-6">
                        <div className="text-sm font-bold text-neutral-content">
                          A
                        </div>
                      </div>
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
