import * as React from 'react';

import { ChakraProvider, theme } from '@chakra-ui/react';
import { RenderOptions, render } from '@testing-library/react';

const AllProviders = ({ children }: { children?: React.ReactNode }) => <ChakraProvider theme={theme}>{children}</ChakraProvider>;

const customRender = (ui: React.ReactElement, options?: RenderOptions) => render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
