/* eslint-disable no-undef */
import React from 'react';
import { render, waitFor, fireEvent, act, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Profile from '../../pages/profile';
import profileThatIsFollowedByTheLoggedInUser from '../../fixtures/profile-followed-by-logged-in-user';
import profileThatNotIsFollowedByTheLoggedInUser from '../../fixtures/profile-not-followed-by-logged-in-user';
import userFixture from '../../fixtures/logged-in-user';
import photosFixture from '../../fixtures/timeline-photos';
import useUser from '../../hooks/use-user';
import { getUserByUsername, getUserPhotosByUserId } from '../../services/firebase';
import FirebaseContext from '../../context/firebase';
import UserContext from '../../context/user';
import * as ROUTES from '../../constants/routes';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ username: 'pr1mus' }),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use-user');

describe('<Profile />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the profile page with an user profile', async () => {
    await act(async () => {
      getUserByUsername.mockImplementation(() => [userFixture]);
      getUserPhotosByUserId.mockImplementation(() => photosFixture);
      useUser.mockImplementation(() => ({ user: userFixture }));

      const { getByText, getByTitle } = render(
        <Router>
          <FirebaseContext.Provider
            value={{
              firebase: {
                auth: jest.fn(() => ({
                  signOut: jest.fn(() => Promise.resolve({}))
                }))
              }
            }}
          >
            <UserContext.Provider value={{ user: { uid: 'meoqrKaMqsecY3rM6T7KnR8duGn1', displayName: 'pr1mus' } }}>
              <Profile />
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.NOT_FOUND);
        expect(getUserByUsername).toHaveBeenCalledWith('pr1mus');
        expect(getByTitle('Sign Out')).toBeTruthy();
        expect(getByText('pr1mus')).toBeTruthy();
        expect(getByText('Sebastian Stögerer')).toBeTruthy();

        screen.getByText((content, node) => {
          const hasText = node => node.textContent === '5 photos';
          const nodeHasText = hasText(node);
          const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
          return nodeHasText && childrenDontHaveText;
        });

        screen.getByText((content, node) => {
          const hasText = node => node.textContent === '3 followers';
          const nodeHasText = hasText(node);
          const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
          return nodeHasText && childrenDontHaveText;
        });

        screen.getByText((content, node) => {
          const hasText = node => node.textContent === '1 following';
          const nodeHasText = hasText(node);
          const childrenDontHaveText = Array.from(node.children).every(child => !hasText(child));
          return nodeHasText && childrenDontHaveText;
        });

        // sign user out
        fireEvent.click(getByTitle('Sign Out'));

        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.LOGIN);

        fireEvent.keyDown(getByTitle('Sign Out'), {
          key: 'Enter'
        });
      });
    });
  });
});
