import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    errors,
    handleSubmit,
    formState,
  } = useForm<ILoginForm>({
    mode: 'onChange',
  });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const [loginMutation, { data: loginResults, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onValid = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex flex-col items-center mt-8 md:mt-24">
      <div className="w-full max-w-screen-sm flex flex-col items-center px-4 md:px-11 ">
        <img
          src="https://d1a3f4spazzrp4.cloudfront.net/arch-frontend/1.1.1/d1a3f4spazzrp4.cloudfront.net/eats/eats-logo-1a01872c77.svg"
          alt="logo"
          className="w-48"
        />
        <h2 className="self-start text-3xl my-9 md:mt-16">Welcome back</h2>
        <h5 className="self-start mb-2">Sign in with your email address.</h5>
        <form
          className="grid gap-3 w-full mb-4"
          onSubmit={handleSubmit(onValid)}
        >
          <input
            ref={register({ required: 'Email is required' })}
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && <FormError error={errors.email?.message} />}
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
          <Button isValid={formState.isValid} loading={loading} text="Log In" />
          {loginResults?.login.error && (
            <FormError error={loginResults.login.error} />
          )}
        </form>
        <div>
          New to Uber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
