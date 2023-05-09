import React from 'react';

import { render, screen } from '@testing-library/react';

import { ErrorBoundary } from './ErrorBoundary';

const ErrorComponent = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders error fallback with the error message when an error is thrown', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
