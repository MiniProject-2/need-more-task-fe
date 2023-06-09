import React from 'react';
import * as C from '@/styles/commonHeader.styles';
import Image from 'next/image';
import Logo from 'public/Logo.png';
import { Button, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import ProfileImage from '@/components/CommonHeader/ProfileImage';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useUserInfo } from '@/store/userInfoStore';
import Link from 'next/link';
import LogoutModal from './LogoutModal';
import { TeamEnum } from '@/utils';
import { useRouter } from 'next/router';
import { useOverViewState } from '@/store/overViewStore';

function CommonHeader() {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const { setCurrentPage, setTotalPage, setDisplayedData } = useOverViewState();
  const pathName = router.pathname;
  const { isOpen, onOpen, onClose } = useDisclosure();
  function storeInit() {
    setDisplayedData(null);
    setCurrentPage(0);
    setTotalPage(0);
  }

  return (
    <C.Container>
      <Menu>
        <C.StyledImage src={Logo} alt="Logo" width={50} height={50} onClick={() => router.push('/')} />
        <C.Nav>
          <ul>
            <Link href={`/dashboard`}>
              <li className={pathName === '/dashboard' ? 'selected' : ''} onClick={storeInit}>
                Dashboard
              </li>
            </Link>
            <Link href={`/kanban`}>
              <li className={pathName === '/kanban' ? 'selected' : ''} onClick={storeInit}>
                Kanban
              </li>
            </Link>
            <Link href={`/`}>
              <li className={pathName === '/' ? 'selected' : ''} onClick={storeInit}>
                Calendar
              </li>
            </Link>
            <Link href={`/tasks`}>
              <li className={pathName === '/tasks' ? 'selected' : ''} onClick={storeInit}>
                Tasks
              </li>
            </Link>
            {userInfo?.userId === 1 && (
              <Link href={`/admin`}>
                <li className={pathName === '/admin' ? 'selected' : ''} onClick={storeInit}>
                  User Role
                </li>
              </Link>
            )}
          </ul>
          {/* <C.CreateTaskButton>New Task</C.CreateTaskButton> */}
          <MenuButton>
            {/* as={Button} */}
            <C.ProfileWrapper>
              <ProfileImage src={userInfo?.profileImageUrl} />
              <ExpandMoreOutlinedIcon />
            </C.ProfileWrapper>
          </MenuButton>
        </C.Nav>

        <MenuList zIndex={10}>
          <MenuGroup title="정보">
            <MenuItem closeOnSelect={false}>부서: {TeamEnum(userInfo?.department)}</MenuItem>
            <MenuItem closeOnSelect={false}>이메일: {userInfo?.email}</MenuItem>
            <MenuItem closeOnSelect={false}>이름: {userInfo?.fullName}</MenuItem>
            <MenuItem closeOnSelect={false}>입사 연도: {userInfo?.joinCompanyYear}</MenuItem>
            <MenuItem closeOnSelect={false}>연락처: {userInfo?.phone}</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="프로필">
            <Link href={`/profile/${userInfo?.userId}`}>
              <MenuItem>프로필 편집</MenuItem>
            </Link>
            {/* <Link href={`/profile/${userInfo?.userId}`}>
              <MenuItem>권한 변경 신청</MenuItem>
            </Link> */}
            <LogoutModal isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
              <MenuItem>로그아웃</MenuItem>
            </LogoutModal>
          </MenuGroup>
        </MenuList>
      </Menu>
    </C.Container>
  );
}

export default CommonHeader;
