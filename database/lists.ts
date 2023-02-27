export type Task = {
  id: number;
  name: string;
  description: string;
};

export type List = {
  id: number;
  title: string;
  description: string;
  tasks: Task[];
};
