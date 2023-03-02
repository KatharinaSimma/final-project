'use client';

import { Task } from '../database/lists';
import { ListWithTaskResponse } from './ListContainer';
import TaskComponent from './TaskComponent';

type Props = {
  list: ListWithTaskResponse;
};

export default function TaskContainer(props: Props) {
  return (
    <div>
      {props.list.tasks.map((task: Task) => (
        <TaskComponent key={`task-${task.id}`} task={task} />
      ))}
    </div>
  );
}
