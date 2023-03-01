'use client';

import { gql, useQuery } from '@apollo/client';
import { Task } from '../database/lists';
import TaskComponent from './TaskComponent';

type Props = {
  listId: number;
};

export default function TaskContainer(props: Props) {
  const getTaskByListId = gql`
    query tasksByListId($listId: ID! = ${props.listId}) {
      tasksByListId(listId: $listId) {
        id
        title
        description
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(getTaskByListId, {
    onCompleted: async () => {
      await refetch;
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.tasksByListId.map((task: Task) => (
        <TaskComponent key={`task-${task.id}`} task={task} />
      ))}
    </div>
  );
}
