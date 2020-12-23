import { render, waitFor } from '../../test-util';
import React from 'react';
import { NotFound } from '../404';

describe('NotFound', () => {
  it('should render', async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toBe('Not Found');
    });
  });
});
