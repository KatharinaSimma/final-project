'use client';

import { Task } from '../../database/lists';
import { ListWithTaskResponse } from './ListContainer';
import TaskComponent from './TaskComponent';

type Props = {
  list: ListWithTaskResponse;
};

export default function TaskContainer(props: Props) {
  const { list } = props;
  return (
    <div>
      {list.tasks.map((task: Task) => (
        <div key={`task-${task.id}`}>
          {!task.done && <TaskComponent task={task} />}
        </div>
      ))}
    </div>
  );
}
