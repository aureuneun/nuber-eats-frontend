import { render } from '@testing-library/react';
import React from 'react';
import { Restaurant } from '../restaurant';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Restaurant', () => {
  it('should render with props', () => {
    const restaurantProps = {
      id: 1,
      coverImg: 'coverImg',
      name: 'name',
      categoryName: 'categoryName',
    };
    const { getByText, container } = render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>
    );
    getByText(restaurantProps.name);
    getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute(
      'href',
      `/restaurant/${restaurantProps.id}`
    );
  });
});
