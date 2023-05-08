import React, { useEffect, useState } from 'react';

import { Flex, Progress } from '@chakra-ui/react';

import { Router } from '../Router/Router';

const Loading = () => (
  <Flex flex="1" align="flex-start">
    <Progress w="full" h="0.4rem" bg="gray.100" colorScheme="brand" isIndeterminate />
  </Flex>
);

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, []);
  return isLoading ? <Loading /> : <Router />;
};
