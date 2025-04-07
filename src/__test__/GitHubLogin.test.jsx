import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GitHubLogin from '../Component/Login/GitHubLogin';

describe('GitHubLogin component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window ).location;
    (window ).location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('renders the login button with text and icon', () => {
    render(<GitHubLogin onSuccess={jest.fn()} onError={jest.fn()} />);
    const button = screen.getByRole('button', { name: /login with github/i });
    expect(button).toBeInTheDocument();
  });

  it('redirects to GitHub OAuth URL on click', () => {
    render(<GitHubLogin onSuccess={jest.fn()} onError={jest.fn()} />);
    const button = screen.getByRole('button', { name: /login with github/i });
    fireEvent.click(button);

    const expectedUrl =
      'https://github.com/login/oauth/authorize?client_id=Ov23lidWLxrz4PKKh3nU&redirect_uri=http://localhost:5173/callback&scope=user:email';

    expect(window.location.href).toBe(expectedUrl);
  });
});
