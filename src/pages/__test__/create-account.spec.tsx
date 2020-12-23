import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { render, waitFor, RenderResult } from '../../test-util';
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from '../create-account';
import userEvent from '@testing-library/user-event';
import { UserRole } from '../../__generated__/globalTypes';

const mockPush = jest.fn();

jest.mock('react-router-dom', () => {
  const module = jest.requireActual('react-router-dom');
  return {
    ...module,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe('CreateAccount', () => {
  let renderResult: RenderResult;
  let mockClient: MockApolloClient;

  beforeEach(async () => {
    await waitFor(() => {
      mockClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Create Account');
    });
  });

  it('should display email validation error', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    await waitFor(() => {
      userEvent.type(email, 'test@mail');
    });
    let error = getByRole('alert');
    expect(error).toHaveTextContent(/please enter a valid email/i);
    await waitFor(() => {
      userEvent.clear(email);
    });
    error = getByRole('alert');
    expect(error).toHaveTextContent(/email is required/i);
  });

  it('should display password validation error', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const password = getByPlaceholderText(/password/i);
    await waitFor(() => {
      userEvent.type(password, '123');
    });
    let error = getByRole('alert');
    expect(error).toHaveTextContent(/password must be more than 4 chars/i);
    await waitFor(() => {
      userEvent.clear(password);
    });
    error = getByRole('alert');
    expect(error).toHaveTextContent(/password is required/i);
  });

  it('should submit form and call mutation', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
    const formData = {
      email: 'test@gmail.com',
      password: 'password',
      role: UserRole.Client,
    };
    const handler = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: '',
        },
      },
    });
    mockClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, handler);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      createAccountInput: {
        ...formData,
      },
    });
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should submit form and display error', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
    const formData = {
      email: 'test@gmail.com',
      password: 'password',
      role: UserRole.Client,
    };
    const handler = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: false,
          error: 'error',
        },
      },
    });
    mockClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, handler);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      createAccountInput: {
        ...formData,
      },
    });
    let error = getByRole('alert');
    expect(error).toHaveTextContent(/error/i);
  });
});
