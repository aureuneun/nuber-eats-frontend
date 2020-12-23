import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { Button } from '../components/button';
import { FormError } from '../components/form-error';
import { LS_TOKEN } from '../constants';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';

export const LOGIN_MUTATION = gql`
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
    if (ok && token) {
      localStorage.setItem(LS_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };
  const [loginMutation, { data: loginResults, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });
  const onValid = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };
  return (
    <div className="h-screen flex flex-col items-center mt-8 md:mt-24">
      <Helmet>
        <title>Log In</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-4">
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
            ref={register({
              required: 'Email is required',
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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
