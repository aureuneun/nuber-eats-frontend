import { createMockClient, MockApolloClient } from 'mock-apollo-client';
import { render, RenderResult, waitFor } from '../../test-util';
import React from 'react';
import { Login, LOGIN_MUTATION } from '../login';
import { ApolloProvider } from '@apollo/client';
import userEvent from '@testing-library/user-event';

describe('Login', () => {
  let renderResult: RenderResult;
  let mockClient: MockApolloClient;

  beforeEach(async () => {
    await waitFor(() => {
      mockClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });

  it('should render', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Log In');
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
    expect(error).toHaveTextContent(/Password must be more than 4 chars/i);
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
    };
    const handler = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: 'token',
          error: '',
        },
      },
    });
    jest.spyOn(Storage.prototype, 'setItem');
    mockClient.setRequestHandler(LOGIN_MUTATION, handler);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      loginInput: {
        ...formData,
      },
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token');
  });

  it('should submit form and display error', async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/email/i);
    const password = getByPlaceholderText(/password/i);
    const button = getByRole('button');
    const formData = {
      email: 'test@gmail.com',
      password: 'password',
    };
    const handler = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: false,
          token: '',
          error: 'error',
        },
      },
    });
    mockClient.setRequestHandler(LOGIN_MUTATION, handler);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(button);
    });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({
      loginInput: {
        ...formData,
      },
    });
    let error = getByRole('alert');
    expect(error).toHaveTextContent(/error/i);
  });
});
