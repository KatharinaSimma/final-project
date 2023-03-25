'use client';

import { ListWithTaskResponse } from './SingleViewList';

type Props = {
  list: ListWithTaskResponse;
  progress: string;
  currentUser: string;
};

export default function ListTitle(props: Props) {
  const style = {
    '--value': props.progress,
    '--size': '3.3rem',
    '--thickness': '5px',
  } as React.CSSProperties;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-14">
      <h1 className="text-3xl text-center border border-transparent">
        {props.list.title}
      </h1>
      <div className="flex gap-3">
        <div className="-space-x-3 avatar-group">
          {props.list.sharedUsers.map((user) => {
            if (props.currentUser === user.username) {
              return null;
            }
            return (
              <div
                className="avatar placeholder"
                key={`shared-with-${user.id}`}
              >
                <div className="w-12 rounded-full bg-neutral-content text-base-100 hover:bg-primary">
                  <span className="text-lg">{user.username.charAt(0)}</span>
                </div>
              </div>
            );
          })}
        </div>
        {props.progress !== '0' ? (
          <div className="radial-progress text-primary" style={style}>
            {props.progress}%
          </div>
        ) : null}
      </div>
    </div>
  );
}
