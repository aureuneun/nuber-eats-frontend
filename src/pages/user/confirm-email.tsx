import { gql, useApolloClient, useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { useMe } from '../../hooks/useMe';
import {
  verifyEmail,
  verifyEmailVariables,
} from '../../__generated__/verifyEmail';

const VERITY_EMAIL_MUTATION = gql`
  mutation verifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const history = useHistory();
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok) {
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push('/');
    }
  };
  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(
    VERITY_EMAIL_MUTATION,
    { onCompleted }
  );
  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    verifyEmail({
      variables: {
        verifyEmailInput: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Verify email</title>
      </Helmet>
      <h2 className="text-xl font-bold tracking-wide mb-3">
        Confirming email...
      </h2>
      <h5 className="text-gray-600 text-sm font-bold tracking-wide">
        Please wait, do not move this page
      </h5>
    </div>
  );
};
