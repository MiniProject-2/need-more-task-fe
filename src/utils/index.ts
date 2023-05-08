import dayjs from 'dayjs';
import { PriorityType, StatusType } from '@/constant/TaskOverview';
import { RoleType } from '@/constant/UserRole';

export function classnames(...args: string[]) {
  return args.join(' ');
}

export const taskTitle = (title: string) => {
  return title.length > 30 ? title.substring(0, 30).concat(' ...' + '더보기') : title;
};

export const setTagColor = (value: string) => {
  switch (value) {
    case StatusType.TODO:
      return 'errorColor';
    case StatusType.IN_PROGRESS:
      return 'warningColor';
    case StatusType.DONE:
      return 'successColor';
    case PriorityType.URGENT:
      return 'errorColor';
    case PriorityType.HIGH:
      return 'warningColor';
    case PriorityType.MEDIUM:
      return 'successColor';
    case PriorityType.LOW:
      return 'primary';
    default:
      return 'labelColor';
  }
};

export const teamOptions = [
  { label: '개발', value: 'DEV' },
  { label: '인사', value: 'HR' },
  { label: '경영', value: 'MANAGEMENT' },
  { label: '무역', value: 'TRADE' },
  { label: '영업', value: 'SALES' },
  { label: '서비스', value: 'SERVICE' },
  { label: '생산', value: 'PRODUCTION' },
  { label: '교육', value: 'EDUCATION' },
  { label: '마케팅', value: 'MARKETING' },
  { label: '기타', value: 'OTHER' },
];

export const getJoinCompanyYear = () => {
  const thisYear = dayjs().year();
  return [...Array(thisYear - 1979)].map((_v, i) => {
    // if (i === 0)
    //   return {
    //     // label: '연 선택',
    //     // value: '',
    //   };
    return {
      label: thisYear - i,
      value: thisYear - i,
    };
  });
};

export const UserRoleEnum = (role: string | undefined) => {
  switch (role) {
    case RoleType.ADMIN:
      return '관리자';
    case RoleType.USER:
      return '일반 사용자';
    default:
      return '일반 사용자';
  }
};
