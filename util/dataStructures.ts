import { Task } from '../database/lists';

export function getLengthOfDoneTasks(tasks: Task[]) {
  if (tasks.length < 1) {
    throw new Error('Cannot process empty tasks');
  }
  return tasks.filter((task: Task) => task.done).length;
}

export function calculateTaskProgress(tasks: Task[]) {
  if (tasks.length < 1) {
    throw new Error('Cannot process empty tasks');
  }
  const numberOfDoneTasks = getLengthOfDoneTasks(tasks);
  return ((numberOfDoneTasks / tasks.length) * 100).toFixed(0);
}
