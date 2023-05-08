import { Icon } from '../Icons';
import { Box, HStack, IconButton, IconButtonProps, Spinner, StackProps } from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export const getPaginationInfo = ({ page = 1, pageSize = 10, totalItems = 0 }) => {
  const firstItemOnPage = (page - 1) * pageSize + 1;
  const lastItemOnPage = Math.min((page - 1) * pageSize + pageSize, totalItems ?? 0);
  const isFirstPage = firstItemOnPage <= 1;
  const isLastPage = lastItemOnPage >= totalItems;
  const firstPage = 1;
  const lastPage = Math.ceil(totalItems / pageSize);

  return {
    firstPage,
    lastPage,
    firstItemOnPage,
    lastItemOnPage,
    isFirstPage,
    isLastPage,
  };
};

export type PaginationContextValue<PageType = number> = {
  page: PageType;
  setPage: (page: PageType) => void;
  firstPage: PageType;
  isFirstPage: boolean;
  lastPage: PageType;
  isLastPage: boolean;
  totalItems: number;
  isLoadingPage: boolean;
  pageSize: number;
  firstItemOnPage: number;
  lastItemOnPage: number;
};

export const PaginationContext = React.createContext<PaginationContextValue>({
  page: 0,
  setPage: () => undefined,
  firstPage: 0,
  isFirstPage: false,
  lastPage: 0,
  isLastPage: false,
  totalItems: 0,
  isLoadingPage: false,
  pageSize: 0,
  firstItemOnPage: 0,
  lastItemOnPage: 0,
});

export const PaginationButtonFirstPage: FC<React.PropsWithChildren<Omit<IconButtonProps, 'aria-label'>>> = ({ ...rest }) => {
  const { setPage, firstPage, isFirstPage } = useContext(PaginationContext);
  return (
    <IconButton
      onClick={() => setPage(firstPage)}
      aria-label={'firstPage'}
      icon={<Icon icon={FiChevronsLeft} fontSize="lg" />}
      size="sm"
      isDisabled={isFirstPage}
      {...rest}
    />
  );
};

export const PaginationButtonPrevPage: FC<React.PropsWithChildren<Omit<IconButtonProps, 'aria-label'>>> = ({ ...rest }) => {
  const { setPage, page, isFirstPage } = useContext(PaginationContext);
  return (
    <IconButton
      onClick={() => setPage(page - 1)}
      aria-label={'prevPage'}
      icon={<Icon icon={FiChevronLeft} fontSize="lg" />}
      size="sm"
      isDisabled={isFirstPage}
      {...rest}
    />
  );
};

export const PaginationButtonLastPage: FC<React.PropsWithChildren<Omit<IconButtonProps, 'aria-label'>>> = ({ ...rest }) => {
  const { setPage, lastPage, isLastPage } = useContext(PaginationContext);
  return (
    <IconButton
      onClick={() => setPage(lastPage)}
      aria-label={'lastPage'}
      icon={<Icon icon={FiChevronsRight} fontSize="lg" />}
      size="sm"
      isDisabled={isLastPage}
      {...rest}
    />
  );
};

export const PaginationButtonNextPage: FC<React.PropsWithChildren<Omit<IconButtonProps, 'aria-label'>>> = ({ ...rest }) => {
  const { setPage, page, isLastPage } = useContext(PaginationContext);
  return (
    <IconButton
      onClick={() => setPage(page + 1)}
      aria-label={'nextPage'}
      icon={<Icon icon={FiChevronRight} fontSize="lg" />}
      size="sm"
      isDisabled={isLastPage}
      {...rest}
    />
  );
};

export const PaginationInfo = ({ ...rest }) => {
  const { firstItemOnPage, lastItemOnPage, totalItems, isLoadingPage } = useContext(PaginationContext);
  return (
    <HStack spacing="1" align="center" textAlign="center" justify="center" {...rest}>
      {isLoadingPage ? (
        <Box as="span" display={{ base: 'none', sm: 'inline' }}>
          <Spinner size="xs" me="1" />
          loading {firstItemOnPage} - {lastItemOnPage} of {totalItems}
        </Box>
      ) : (
        // showing firstItemOnPage to lastItemOnPage of totalItems
        <Box as="span" display={{ base: 'none', sm: 'inline' }}>
          showing {firstItemOnPage} - {lastItemOnPage} of {totalItems}
        </Box>
      )}
    </HStack>
  );
};

export type PaginationProps = StackProps & {
  setPage: (page: number) => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  isLoadingPage?: boolean;
};

export const Pagination = ({ setPage, page = 1, pageSize = 10, totalItems = 0, isLoadingPage = false, ...rest }: PaginationProps) => {
  const pagination = getPaginationInfo({ page, pageSize, totalItems });
  return (
    <PaginationContext.Provider
      value={{
        setPage,
        page,
        pageSize,
        totalItems,
        isLoadingPage,
        ...pagination,
      }}
    >
      <HStack w="full" {...rest} />
    </PaginationContext.Provider>
  );
};
