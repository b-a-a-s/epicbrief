import React, { FC } from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '../src/config';
import theme from '../src/theme';

const queryClient = new QueryClient();

export const Providers: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </QueryClientProvider>
  );
};
