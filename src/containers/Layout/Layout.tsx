import React, { FC, useContext, useEffect, useMemo, useState } from 'react';

import { Box, Flex, IconButton, IconButtonProps, SlideFade, useColorMode, useColorModeValue, useTheme } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';

import { Logo } from '../../components/Logo';
import { Viewport } from '../../components/Viewport';

type LayoutContextValue = {
  isFocusMode: boolean;
  setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>> | undefined;
};

export const LayoutContext = React.createContext<LayoutContextValue>({
  isFocusMode: false,
  setIsFocusMode: undefined,
});

export const useLayoutContext = () => useContext(LayoutContext);

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { toggleColorMode } = useColorMode();
  const text = useColorModeValue('dark', 'light');
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${text} mode`}
      {...props}
    />
  );
};

export const useFocusMode = (enabled = true) => {
  const ctx = useLayoutContext();
  const { setIsFocusMode } = ctx || {};

  useEffect(() => {
    setIsFocusMode?.(enabled);
    return () => setIsFocusMode?.(false);
  }, [ctx, setIsFocusMode, enabled]);
};

export const TopBar = () => {
  const theme = useTheme();

  return (
    <>
      <SlideFade in offsetY={-40} style={{ zIndex: 2 }}>
        <Flex
          position="fixed"
          top="0"
          insetStart="0"
          insetEnd="0"
          color="gray.50"
          align="center"
          pt="safe-top"
          px="4"
          h={theme.layout.topBar.height}
          bg="gray.800"
          _dark={{ bg: 'gray.900' }}
        >
          <Box as={RouterLink} to="/" mx={{ base: 'auto', [theme.layout.breakpoints.desktop]: 0 }}>
            <Logo />
          </Box>
          <Box flex="1" textAlign="end">
            <ColorModeSwitcher />
          </Box>
        </Flex>
      </SlideFade>
      <Box h={theme.layout.topBar.height} />
    </>
  );
};

export const Layout: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const providerValue = useMemo(() => ({ isFocusMode, setIsFocusMode }), [isFocusMode]);

  return (
    <LayoutContext.Provider value={providerValue}>
      <Viewport>
        {!isFocusMode && <TopBar />}
        <Flex flex="1" direction="column">
          {children}
        </Flex>
      </Viewport>
    </LayoutContext.Provider>
  );
};
