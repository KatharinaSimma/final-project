'use client';

type Props = { title: string; progress: string };

export default function ListTitle(props: Props) {
  const style = {
    '--value': props.progress,
    '--size': '3.3rem',
    '--thickness': '5px',
  } as React.CSSProperties;

  return (
    <div className="flex flex-col max-w-lg p-3 m-auto mb-12 sm:p-0">
      <div className="flex items-center justify-between gap-3 py-5">
        <h1 className="text-3xl text-center border border-transparent">
          {props.title}
        </h1>
        {props.progress !== '0' ? (
          <div className="radial-progress text-primary" style={style}>
            {props.progress}%
          </div>
        ) : null}
      </div>
    </div>
  );
}
