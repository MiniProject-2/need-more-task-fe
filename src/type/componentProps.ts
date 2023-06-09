import { DraggableProvided, DroppableProvided } from 'react-beautiful-dnd';
import { TaskData } from '@/apis/kanban';
import { actionType, StatusType } from '@/constant/TaskOverview';
import { TaskPostData } from '@/apis/task';

export interface KanbanDroppableItemProps {
  status: string;
  provided: DroppableProvided;
  data: TaskData[];
}

export interface KanbanDraggableItemProps {
  task: TaskData;
  provided: DraggableProvided;
  index: number;
}

export interface ModalActionLayoutProps {
  item:
    | { key: string; date?: Date | undefined; value?: string | undefined }
    | { key: string; value?: string | undefined }
    | { key: string; value?: StatusType | undefined };
}

export interface ModalActionComponentProps {
  action: actionType;
  setTaskStatusHandler?: (e: unknown) => void;
  id?: number;
}

export interface ModalActionEditProps {
  action: actionType;
  id: number;
  taskData: TaskPostData;
  refetch: any;
}

export interface ModalActionAssigneeProps {
  setTaskAssigneeHandler?: (e: unknown) => void;
}

export interface OverViewProps {
  date?: any;
  content?: any;
  isLoading?: boolean;
  isFetching?: any;
  fetchNextPage?: any;
  totalCount?: number;
  todoCount?: number;
  inProgressCount?: number;
  doneCount?: number;
}

export interface TaskOverviewProps {
  taskId: number;
  title: string;
  progress: string;
  id: number;
  assignee: Assignee[];
  startAt: string;
  endAt: string;
}
export interface Assignee {
  userId: number;
  profileImageUrl: string;
  name: string;
}
