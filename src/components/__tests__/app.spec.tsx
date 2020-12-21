import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { isLoggedInVar } from '../../apollo';
import { App } from '../app';

jest.mock('../../routers/logged-out-router', () => {
  return {
    LoggedOutRouter: () => <span>Logged out</span>,
  };
});

jest.mock('../../routers/logged-in-router', () => {
  return {
    LoggedInRouter: () => <span>Logged in</span>,
  };
});

describe('App', () => {
  it('should render LoggedOutRouter', () => {
    const { getByText } = render(<App />);
    getByText('Logged out');
  });

  it('should render LoggedInRouter', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => isLoggedInVar(true));
    getByText('Logged in');
  });
});
