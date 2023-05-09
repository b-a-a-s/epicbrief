import React, { ReactElement } from 'react';

import { Center, Heading, Link, Stack, Text } from '@chakra-ui/react';

import { Logo } from '../Logo/Logo';
import { Illustration403 } from './Illustration403';
import { Illustration404 } from './Illustration404';
import { IllustrationDefault } from './IllustrationDefault';

const SupportedErrors: Record<'default' | 403 | 404, { illustration?: ReactElement }> = {
  default: { illustration: <IllustrationDefault /> },
  403: { illustration: <Illustration403 /> },
  404: { illustration: <Illustration404 /> },
};

export const ErrorPage = ({ errorCode }: { errorCode?: number }) => {
  const errorType = errorCode && errorCode in SupportedErrors ? (errorCode as keyof typeof SupportedErrors) : 'default';
  const illustration = SupportedErrors[errorType].illustration ?? SupportedErrors.default.illustration ?? null;

  return (
    <Center flex="1" p="8">
      <Stack direction={{ base: 'column-reverse', md: 'row' }} align="center" spacing={4}>
        {illustration}
        <Stack textAlign={{ base: 'center', md: 'left' }} alignItems={{ base: 'center', md: 'flex-start' }}>
          <Link href="/">
            <Logo my={4} />
          </Link>
          <Heading>Error Title</Heading>
          <Text>Error Description</Text>
          {!!errorCode && (
            <Text color="gray.500" _dark={{ color: 'gray.400' }} fontSize="sm" mt={4}>
              `Error {errorCode}`
            </Text>
          )}
        </Stack>
      </Stack>
    </Center>
  );
};
