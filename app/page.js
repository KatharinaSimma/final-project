import lists from '../database/lists.json';
import List from './List';

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-7rem)] mb-12  p-2">
      <h1 className="py-5 text-3xl text-center">Your Lists</h1>
      <div className="max-w-5xl m-auto ">
        {lists.map((list) => {
          return (
            <List
              key={`list_name_${list.id}`}
              taskList={list}
              tasks={list.tasks}
            />
          );
        })}
      </div>
    </main>
  );
}
