import { notFound } from 'next/navigation';
import lists from '../../database/lists.json';
import Task from '../Task';
import { listNotFoundMetadata } from './not-found';

export const dynamic = 'force-dynamic';

type Props = {
  params: { listsId: string };
};

export function generateMetadata(props: Props) {
  const singleList = lists.find((list) => {
    return list.id === parseInt(props.params.listsId);
  });

  if (!singleList) {
    return listNotFoundMetadata;
  }

  return {
    title: singleList.title,
    description: `Product page for ${singleList.title}`,
  };
}

export default function ListsPage(props: Props) {
  const singleList = lists.find((list) => {
    return list.id === parseInt(props.params.listsId);
  });

  if (singleList === undefined) {
    notFound();
  }

  return (
    <main className="p-2">
      <h1 className="py-5 text-3xl text-center">
        Edit List: {singleList.title}
      </h1>
      <div className="max-w-lg mx-auto">
        {singleList.tasks.map((task) => {
          return (
            <div className="my-4 border rounded-md" key={`task-${task.id}`}>
              <Task task={task} />
            </div>
          );
        })}
      </div>
    </main>
  );
}
