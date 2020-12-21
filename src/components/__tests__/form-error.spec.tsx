import { render } from '@testing-library/react';
import React from 'react';
import { FormError } from '../form-error';

describe('FormError', () => {
  it('should render error', () => {
    const { getByText } = render(<FormError error={'error'} />);
    getByText('error');
  });
});
