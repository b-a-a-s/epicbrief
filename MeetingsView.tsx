// how deploy
// how test
// server side pagination
// how to filer by date range
import { ActionsButton } from '@/components/ActionsButton';
import { ConfirmMenuItem } from '@/components/ConfirmMenuItem';
import { DataList, DataListCell, DataListFooter, DataListHeader, DataListRow } from '@/components/DataList';
import { DateAgo } from '@/components/DateAgo';
import { Icon } from '@/components/Icons';
import {
  Pagination,
  PaginationButtonFirstPage,
  PaginationButtonLastPage,
  PaginationButtonNextPage,
  PaginationButtonPrevPage,
  PaginationInfo,
} from '@/components/Pagination';
import { useToastError, useToastSuccess } from '@/components/Toast';
import { Page, PageContent } from '@/spa/layout';
import { useMeetingList, useUserRemove, useUserUpdate } from '@/spa/meetings.service';
import { Meeting, User } from '@/spa/meetings.types';
import { usePaginationFromUrl } from '@/spa/router';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Heading,
  IconButton,
  LinkBox,
  LinkOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuProps,
  Portal,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiChevronDown, FiEdit, FiPlus, FiRefreshCw, FiTrash2, FiXCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

type UserActionProps = Omit<MenuProps, 'children'> & { user: User };

const UserActions = ({ user, ...rest }: UserActionProps) => {
  const { t } = useTranslation(['common', 'meetings']);
  const toastSuccess = useToastSuccess();
  const toastError = useToastError();
  const userUpdate = useUserUpdate({
    onSuccess: ({ activated, login }) => {
      if (activated) {
        toastSuccess({
          title: t('meetings:feedbacks.activateUserSuccess.title'),
          description: t('meetings:feedbacks.activateUserSuccess.description', {
            login,
          }),
        });
      } else {
        toastSuccess({
          title: t('meetings:feedbacks.deactivateUserSuccess.title'),
          description: t('meetings:feedbacks.deactivateUserSuccess.description', { login }),
        });
      }
    },
    onError: (_, { activated, login }) => {
      if (activated) {
        toastError({
          title: t('meetings:feedbacks.activateUserError.title'),
          description: t('meetings:feedbacks.activateUserError.description', {
            login,
          }),
        });
      } else {
        toastError({
          title: t('meetings:feedbacks.deactivateUserError.title'),
          description: t('meetings:feedbacks.deactivateUserError.description', {
            login,
          }),
        });
      }
    },
  });

  const activateUser = () => userUpdate.mutate({ ...user, activated: true });
  const deactivateUser = () => userUpdate.mutate({ ...user, activated: false });
  const isActionsLoading = userUpdate.isLoading;

  const userRemove = useUserRemove({
    onSuccess: (_, { login }) => {
      toastSuccess({
        title: t('meetings:feedbacks.deleteUserSuccess.title'),
        description: t('meetings:feedbacks.deleteUserSuccess.description', {
          login,
        }),
      });
    },
    onError: (_, { login }) => {
      toastError({
        title: t('meetings:feedbacks.deleteUserError.title'),
        description: t('meetings:feedbacks.deleteUserError.description', {
          login,
        }),
      });
    },
  });
  const removeUser = () => userRemove.mutate(user);
  const isRemovalLoading = userRemove.isLoading;

  return (
    <Menu isLazy placement="left-start" {...rest}>
      <MenuButton as={ActionsButton} isLoading={isActionsLoading || isRemovalLoading} />
      <Portal>
        <MenuList>
          <MenuItem as={Link} to={user.login} icon={<Icon icon={FiEdit} fontSize="lg" color="gray.400" />}>
            {t('common:actions.edit')}
          </MenuItem>
          {user.activated ? (
            <MenuItem onClick={deactivateUser} icon={<Icon icon={FiXCircle} fontSize="lg" color="gray.400" />}>
              {t('common:actions.deactivate')}
            </MenuItem>
          ) : (
            <MenuItem onClick={activateUser} icon={<Icon icon={FiCheckCircle} fontSize="lg" color="gray.400" />}>
              {t('common:actions.activate')}
            </MenuItem>
          )}
          <MenuDivider />
          <ConfirmMenuItem icon={<Icon icon={FiTrash2} fontSize="lg" color="gray.400" />} onClick={removeUser}>
            {t('common:actions.delete')}
          </ConfirmMenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

const MeetingsView = () => {
  const { t } = useTranslation(['meetings']);
  const { page, setPage } = usePaginationFromUrl();
  const pageSize = 20;
  const meetings = useMeetingList({ page: page - 1, size: pageSize });
  const getContactName = (id: string) => {
    const contact = meetings?.contacts?.find((contact) => contact.id === id);
    return contact?.properties?.firstname + ' ' + contact?.properties?.lastname;
  };
  const getContactEmail = (id: string) => {
    const contact = meetings?.contacts?.find((contact) => contact.id === id);
    return contact?.properties?.email;
  };

  return (
    <Page containerSize="xl">
      <PageContent>
        <HStack mb="4">
          <Box flex="1">
            <Heading size="md">{t('meetings:list.title')}</Heading>
          </Box>
        </HStack>
        <HStack mb="4">
          <Box flex="1">
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} display={{ base: 'none', md: 'flex' }}>
                Filter
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={IconButton} aria-label="Options" icon={<FiPlus />} variant="outline" display={{ base: 'flex', md: 'none' }} />
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
          </Box>
          <Box flex="1">
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} display={{ base: 'none', md: 'flex' }}>
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={IconButton} aria-label="Options" icon={<FiPlus />} variant="outline" display={{ base: 'flex', md: 'none' }} />
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
          </Box>
          <Box flex="1">
            <Menu>
              <MenuButton as={Button} rightIcon={<FiChevronDown />} display={{ base: 'none', md: 'flex' }}>
                Sort
              </MenuButton>
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
            <Menu>
              <MenuButton as={IconButton} aria-label="Options" icon={<FiPlus />} variant="outline" display={{ base: 'flex', md: 'none' }} />
              <MenuList>
                <MenuItem>Download</MenuItem>
                <MenuItem>Create a Copy</MenuItem>
                <MenuItem>Mark as Draft</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Attend a Workshop</MenuItem>
              </MenuList>
            </Menu>
          </Box>
          <Box>
            <Button display={{ base: 'none', sm: 'flex' }} as={Link} to="create" variant="@primary" leftIcon={<FiPlus />}>
              {t('meetings:list.actions.createMeeting')}
            </Button>
            <IconButton
              display={{ base: 'flex', sm: 'none' }}
              aria-label={t('meetings:list.actions.createMeeting')}
              as={Link}
              to="create"
              size="sm"
              variant="@primary"
              icon={<FiPlus />}
            />
          </Box>
        </HStack>

        <DataList>
          <DataListHeader isVisible={{ base: false, md: true }}>
            <DataListCell colName="name">{t('meetings:data.name.label')}</DataListCell>
            <DataListCell colName="time" isVisible={{ base: false, lg: true }}>
              {t('meetings:data.time.label')}
            </DataListCell>
            <DataListCell colName="account" isVisible={{ base: false, lg: true }}>
              {t('meetings:data.account.label')}
            </DataListCell>
            <DataListCell colName="nextSteps" isVisible={{ base: false, md: true }}>
              {t('meetings:data.nextSteps.label')}
            </DataListCell>
            <DataListCell colName="actions" colWidth="4rem" align="flex-end" />
          </DataListHeader>
          {meetings.isError && (
            <Center p={4}>
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>{t('meetings:feedbacks.loadingUserError.title')}</AlertTitle>
                <AlertDescription>
                  {t('meetings:feedbacks.loadingUserError.description')}
                  <Button
                    colorScheme="error"
                    variant="ghost"
                    size="sm"
                    leftIcon={<FiRefreshCw />}
                    isLoading={meetings.isLoadingPage}
                    onClick={() => meetings.refetch()}
                  >
                    {t('meetings:list.actions.refetch')}
                  </Button>
                </AlertDescription>
              </Alert>
            </Center>
          )}
          {meetings?.meetings?.slice(pageSize * (page - 1), pageSize * page).map((user) => (
            <DataListRow as={LinkBox} key={user.id}>
              <DataListCell colName="name">
                <LinkOverlay as={Link} to={user.id}>
                  <Text noOfLines={1} maxW="full">
                    {user.properties.hs_meeting_title}
                  </Text>
                </LinkOverlay>
              </DataListCell>
              <DataListCell colName="time" fontSize="sm" position="relative" pointerEvents="none">
                <Text noOfLines={1} maxW="full">
                  {user.createdAt}
                </Text>
                {!!user.createdAt && (
                  <Text noOfLines={1} maxW="full" pointerEvents="auto" color="gray.600" _dark={{ color: 'gray.300' }}>
                    <DateAgo date={user.createdAt} />
                  </Text>
                )}
              </DataListCell>
              <DataListCell colName="account">
                <HStack maxW="100%">
                  <Avatar size="sm" name={user.id} mx="1" />
                  <Box minW="0">
                    <Text noOfLines={1} maxW="full" fontWeight="bold">
                      {getContactName(user.associations?.contacts?.results[0]?.id || '')}
                    </Text>
                    <Text noOfLines={1} maxW="full" fontSize="sm" color="gray.600" _dark={{ color: 'gray.300' }}>
                      {getContactEmail(user.associations?.contacts?.results[0]?.id || '')}
                    </Text>
                  </Box>
                </HStack>
              </DataListCell>
              <DataListCell colName="nextSteps" fontSize="sm" position="relative" pointerEvents="none">
                <Text noOfLines={1} maxW="full">
                  {user.properties.hs_internal_meeting_notes || user.properties.hs_meeting_outcome}
                </Text>
              </DataListCell>
              <DataListCell colName="actions">{/*  <UserActions user={user} /> */}</DataListCell>
            </DataListRow>
          ))}
          <DataListFooter>
            <Pagination
              isLoadingPage={meetings.isLoadingPage}
              setPage={setPage}
              page={page}
              pageSize={pageSize}
              totalItems={meetings.totalItems}
            >
              <PaginationButtonFirstPage />
              <PaginationButtonPrevPage />
              <PaginationInfo flex="1" />
              <PaginationButtonNextPage />
              <PaginationButtonLastPage />
            </Pagination>
          </DataListFooter>
        </DataList>
      </PageContent>
    </Page>
  );
};

export default MeetingsView;
// {!!user.createdAt && (
// <Text noOfLines={1} maxW="full" pointerEvents="auto" color="gray.600" _dark={{ color: 'gray.300' }}>
// <DateAgo position="relative" date={user.createdAt} />
// </Text>
// )}
