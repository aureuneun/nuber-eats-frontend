import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import React from 'react';
import { Category } from '../category';

describe('Category', () => {
  it('should render with props', () => {
    const categoryProps = {
      id: 1,
      slug: 'slug',
      coverImg: 'coverImg',
      name: 'name',
    };
    const { getByText, container } = render(
      <Router>
        <Category {...categoryProps} />
      </Router>
    );
    expect(container.firstChild).toHaveAttribute(
      'href',
      `/category/${categoryProps.slug}`
    );
    expect(container.getElementsByTagName('img')[0]).toHaveAttribute(
      'src',
      categoryProps.coverImg
    );
    getByText(categoryProps.name);
  });
});
