/* eslint-disable no-undef */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, act, waitFor, queryByText } from '@testing-library/react';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';
import NotFound from '../../pages/not-found';
import { getUserByUserId } from '../../services/firebase';
import userFixture from '../../fixtures/logged-in-user';

jest.mock('../../services/firebase');

describe('<NotFound />', () => {
  it('renders the not found page with a logged in user', async () => {
    await act(async () => {
      getUserByUserId.mockImplementation(() => [userFixture]);

      const { queryByText } = render(
        <Router>
          <FirebaseContext.Provider value={{}}>
            <UserContext.Provider value={{ user: { uid: 1 } }}>
              <NotFound />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(queryByText('Log In')).toBeFalsy();
        expect(queryByText('Not Found!')).toBeTruthy();
        expect(document.title).toBe('404 - Not Found!');
      });
    });
  });

  it('renders the not found page with no user logged in', async () => {
    await act(async () => {
      getUserByUserId.mockImplementation(() => []);

      const { queryByText } = render(
        <Router>
          <FirebaseContext.Provider value={{}}>
            <UserContext.Provider value={{ user: {} }}>
              <NotFound />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(queryByText('Not Found!')).toBeTruthy();
        expect(document.title).toBe('404 - Not Found!'); // CONTINUE: 50:21
      });
    });
  });
});
