import React from 'react';

import { render } from '@testing-library/react';

import { ErrorPage } from './ErrorPage';

// Mock Chakra UI components
jest.mock('@chakra-ui/react', () => ({
  Center: jest.fn(({ children }) => <div>{children}</div>),
  Heading: jest.fn(({ children }) => <div>{children}</div>),
  Link: jest.fn(({ children, href }) => <a href={href}>{children}</a>),
  Stack: jest.fn(({ children }) => <div>{children}</div>),
  Text: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('ErrorPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<ErrorPage errorCode={403} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
