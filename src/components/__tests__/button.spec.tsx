import { render } from '@testing-library/react';
import React from 'react';
import { Button } from '../button';

describe('Button', () => {
  it('should render with props', () => {
    const { getByText } = render(
      <Button isValid={true} loading={false} text={'test'} />
    );
    getByText('test');
  });

  it('should render Loading', () => {
    const { getByText } = render(
      <Button isValid={true} loading={true} text={'test'} />
    );
    getByText('Loading...');
  });

  it('should not be valid', () => {
    const { container } = render(
      <Button isValid={false} loading={false} text={'test'} />
    );
    expect(container.firstChild).toHaveClass('pointer-events-none');
  });
});
