import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Callback from '../Component/Login/Callback';


global.fetch = jest.fn();

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  delete window.location;
  window.location = { search: '' };
});

describe('Callback Component', () => {
  it('fetches token and user data, stores username and navigates to dashboard', async () => {
    
    window.location.search = '?code=1234';

    
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'mocked_token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ login: 'testuser' }),
      });

    render(
      <MemoryRouter initialEntries={['/callback?code=1234']}>
        <Routes>
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(
        1,
        'http://localhost:3000/api/auth/github/callback',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: '1234' }),
        }
      );
      expect(fetch).toHaveBeenNthCalledWith(
        2,
        'https://api.github.com/user',
        {
          headers: { Authorization: 'Bearer mocked_token' },
        }
      );
      expect(localStorage.getItem('userName')).toBe('testuser');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 2000 });
  });

  it('handles error and redirects to home on token fetch failure', async () => {
    window.location.search = '?code=bad_code';

    fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    render(
      <MemoryRouter initialEntries={['/callback?code=bad_code']}>
        <Routes>
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/auth/github/callback',
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 2000 });
  });

  it('handles error when no access token is received', async () => {
    window.location.search = '?code=1234';

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: 'No token' }), 
    });

    render(
      <MemoryRouter initialEntries={['/callback?code=1234']}>
        <Routes>
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    }, { timeout: 2000 });
  });

  it('does nothing if no code is present in the URL', async () => {
    window.location.search = '';

    render(
      <MemoryRouter initialEntries={['/callback']}>
        <Routes>
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </MemoryRouter>
    );

    
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(fetch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('uses fallback username when login is not available', async () => {
    window.location.search = '?code=1234';

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'mocked_token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ name: 'Test Name' }), 
      });

    render(
      <MemoryRouter initialEntries={['/callback?code=1234']}>
        <Routes>
          <Route path="/callback" element={<Callback />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(localStorage.getItem('userName')).toBe('Test Name');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    }, { timeout: 2000 });
  });
});