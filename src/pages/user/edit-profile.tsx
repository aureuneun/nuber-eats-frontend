import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { useMe } from '../../hooks/useMe';
import {
  editProfile,
  editProfileVariables,
} from '../../__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

interface IEditFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const client = useApolloClient();
  const { data: userData } = useMe();
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { id, email: prevEmail },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });
  const {
    register,
    handleSubmit,
    errors,
    formState,
    getValues,
  } = useForm<IEditFormProps>({
    defaultValues: {
      email: userData?.me.email,
    },
    mode: 'onChange',
  });
  const onValid = () => {
    if (!loading) {
      const { email, password } = getValues();
      editProfile({
        variables: {
          editProfileInput: {
            email,
            ...(password !== '' && { password }),
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex flex-col items-center mt-24">
      <Helmet>
        <title>Edit Profile</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-4">
        <h2 className="self-start text-3xl mb-9">Edit Profile</h2>
        <h5 className="self-start mb-2">Sign in with your email address.</h5>
        <form
          className="grid gap-3 w-full mb-4"
          onSubmit={handleSubmit(onValid)}
        >
          <input
            ref={register({
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.type === 'pattern' && (
            <FormError error="Please enter a valid email" />
          )}
          <input
            ref={register({ minLength: 4 })}
            name="password"
            type="password"
            placeholder="Password"
            className="input"
          />
          {errors.password?.type === 'minLength' && (
            <FormError error="Password must be more than 4 chars" />
          )}
          <Button
            isValid={formState.isValid}
            loading={loading}
            text="Save Profile"
          />
          {/* {loginResults?.login.error && (
          <FormError error={loginResults.login.error} />
        )} */}
        </form>
      </div>
    </div>
  );
};
