import { Flex, FlexProps, useMediaQuery } from '@chakra-ui/react';
import React, { useEffect } from 'react';

const useFixViewport = () => {
  useEffect(() => {
    const updateCssViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateCssViewportHeight();
    window.addEventListener('resize', updateCssViewportHeight);

    return () => {
      window.removeEventListener('resize', updateCssViewportHeight);
    };
  }, []);
};

export const Viewport = (props: FlexProps) => {
  const [isStandalone] = useMediaQuery('(display-mode: standalone)');
  useFixViewport();

  return (
    <Flex
      direction="column"
      overflowX="auto"
      minH="100vh"
      w="full"
      maxW="100vw"
      style={
        !isStandalone
          ? {
              minHeight: 'calc(var(--vh, 1vh) * 100)',
            }
          : {}
      }
      {...props}
    />
  );
};
