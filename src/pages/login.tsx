import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
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
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
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
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-5 pb-7 rounded-lg text-center">
        <h3 className="font-bold text-2xl text-gray-800">Log In</h3>
        <form className="grid gap-3 mt-5 px-5" onSubmit={handleSubmit(onValid)}>
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
          <button className="btn">{loading ? 'Loading...' : 'Log In'}</button>
          {loginResults?.login.error && (
            <FormError error={loginResults.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
