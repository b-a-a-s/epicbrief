import React, { useContext } from 'react';

import { Box, Flex, FlexProps, HStack, IconButton, Stack, useTheme } from '@chakra-ui/react';
import { FiArrowLeft } from 'react-icons/fi';
import useMeasure from 'react-use-measure';

import { useFocusMode, useLayoutContext } from '../Layout/Layout';

type PageContextValue = {
  hideContainer: boolean;
  containerSize: keyof typeof containerSizes;
};

const PageContext = React.createContext<PageContextValue>({} as PageContextValue);

const containerSizes = {
  sm: '60ch',
  md: '80ch',
  lg: '100ch',
  xl: '140ch',
  full: '100%',
} as const;

const PageContainer = ({ children, ...rest }: FlexProps) => {
  const { hideContainer, containerSize } = useContext(PageContext);

  if (hideContainer) return <>{children}</>;

  return (
    <Flex direction="column" flex="1" w="full" px="6" mx="auto" maxW={containerSizes[containerSize]} {...rest}>
      {children}
    </Flex>
  );
};

type PageTopBarProps = FlexProps & {
  onBack?(): void;
  showBack?: boolean;
  isFixed?: boolean;
};

export const PageTopBar = ({ children, onBack = () => undefined, showBack = false, isFixed = false, ...rest }: PageTopBarProps) => {
  const { isFocusMode } = useLayoutContext();
  const theme = useTheme();
  const [ref, { height }] = useMeasure();

  return (
    <>
      {isFixed && <Box h={`${height}px`} />}
      <Flex
        zIndex="2"
        direction="column"
        pt="4"
        pb="4"
        boxShadow="0 4px 20px rgba(0, 0, 0, 0.05)"
        bg="white"
        ref={ref}
        _dark={{ bg: 'gray.900' }}
        {...(isFixed
          ? {
              top: !isFocusMode ? theme.layout.topBar.height : '0',
              position: 'fixed',
              right: '0',
              left: '0',
            }
          : {})}
        {...rest}
      >
        <Box w="full" h="0" pb="safe-top" />
        <PageContainer>
          <HStack spacing="4">
            {showBack && (
              <Box ms={{ base: 0, lg: '-3.5rem' }}>
                <IconButton aria-label="Go Back" icon={<FiArrowLeft />} variant="ghost" onClick={() => onBack()} />
              </Box>
            )}
            <Box flex="1">{children}</Box>
          </HStack>
        </PageContainer>
      </Flex>
    </>
  );
};

type PageContentProps = FlexProps & {
  onBack?(): void;
  showBack?: boolean;
};

export const PageContent = ({ children, ...rest }: PageContentProps) => {
  return (
    <Flex zIndex="1" direction="column" flex="1" py="4" {...rest}>
      <PageContainer>
        <Stack direction={{ base: 'column', lg: 'row' }} spacing={{ base: '4', lg: '8' }} flex="1">
          <Flex direction="column" flex="1" minW="0">
            {' '}
            {children}{' '}
          </Flex>
        </Stack>
      </PageContainer>
      <Box w="full" h="0" pb="safe-bottom" />
    </Flex>
  );
};

export const PageBottomBar = ({ children, ...rest }: FlexProps) => {
  const [ref, { height }] = useMeasure();

  return (
    <>
      <Box h={`${height}px`} />
      <Flex
        zIndex="3"
        ref={ref}
        direction="column"
        mt="auto"
        position="fixed"
        bottom="0"
        insetStart="0"
        insetEnd="0"
        py="2"
        boxShadow="0 -4px 20px rgba(0, 0, 0, 0.05)"
        bg="white"
        _dark={{ bg: 'gray.900' }}
        {...rest}
      >
        <PageContainer>{children}</PageContainer>
        <Box w="full" h="0" pb="safe-bottom" />
      </Flex>
    </>
  );
};

type PageProps = FlexProps & {
  isFocusMode?: boolean;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  hideContainer?: boolean;
};

export const Page = ({ isFocusMode = false, hideContainer = false, containerSize = 'md', ...rest }: PageProps) => {
  useFocusMode(isFocusMode);
  return (
    <PageContext.Provider value={{ hideContainer, containerSize }}>
      <Flex direction="column" flex="1" position="relative" {...rest} />
    </PageContext.Provider>
  );
};
