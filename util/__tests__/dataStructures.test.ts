import { Task } from '../../database/lists';
import { calculateTaskProgress, getLengthOfDoneTasks } from '../dataStructures';

// length: 6 | 4 done | 67%
const tasksOne: Task[] = [
  {
    id: 50,
    title: 'asdf',
    done: true,
  },
  {
    id: 52,
    title: 'asg',
    done: true,
  },
  {
    id: 53,
    title: 'ah',
    done: false,
  },
  {
    id: 54,
    title: 'asgd',
    done: true,
  },
  {
    id: 51,
    title: 'adsg',
    done: true,
  },
  {
    id: 55,
    title: 'Pizzeria Riva',
    done: false,
  },
];

// length: 2 | 1 done | 50%
const tasksTwo: Task[] = [
  {
    id: 29,
    title: 'Pizzeria Riva',
    done: false,
  },
  {
    id: 28,
    title: 'Carl-Zone',
    done: true,
  },
];

test('get length of done tasks', () => {
  expect(getLengthOfDoneTasks(tasksOne)).toBe(4);
  expect(getLengthOfDoneTasks(tasksTwo)).toBe(1);
  expect(() => getLengthOfDoneTasks([])).toThrow('Cannot process empty tasks');
});

test('calculate percentage of tasks that are done', () => {
  expect(calculateTaskProgress(tasksOne)).toBe('67');
  expect(calculateTaskProgress(tasksTwo)).toBe('50');
  expect(() => calculateTaskProgress([])).toThrow('Cannot process empty tasks');
});
