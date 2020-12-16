import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation';
import { UserRole } from '../__generated__/globalTypes';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: 'onChange',
  });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      history.push('/');
    }
  };
  const [
    createAccountMutation,
    { data: createAccountResults, loading },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onCompleted,
    }
  );
  const onValid = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex flex-col items-center mt-8 md:mt-24">
      <Helmet>
        <title>Create Account</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-4 md:px-11 ">
        <img
          src="https://d1a3f4spazzrp4.cloudfront.net/arch-frontend/1.1.1/d1a3f4spazzrp4.cloudfront.net/eats/eats-logo-1a01872c77.svg"
          alt="logo"
          className="w-48"
        />
        <h2 className="self-start text-3xl my-9 md:mt-16">Let's get started</h2>
        <h5 className="self-start mb-2">Enter your email address(required)</h5>
        <form
          className="grid gap-3 w-full mb-4"
          onSubmit={handleSubmit(onValid)}
        >
          <input
            ref={register({
              required: 'Email is required',
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && <FormError error={errors.email?.message} />}
          {errors.email?.type === 'pattern' && (
            <FormError error="Please enter a valid email" />
          )}
          <input
            ref={register({ required: 'Password is required', minLength: 4 })}
            name="password"
            type="password"
            required
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && (
            <FormError error={errors.password?.message} />
          )}
          {errors.password?.type === 'minLength' && (
            <FormError error="Password must be more than 4 chars" />
          )}
          <select
            ref={register({ required: true })}
            name="role"
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            isValid={formState.isValid}
            loading={loading}
            text="Create Account"
          />
          {createAccountResults?.createAccount.error && (
            <FormError error={createAccountResults.createAccount.error} />
          )}
        </form>
        <div>
          Already use Uber?{' '}
          <Link to="/" className="text-lime-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
