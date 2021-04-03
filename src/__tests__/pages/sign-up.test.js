/* eslint-disable no-undef */
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SignUp from '../../pages/sign-up';
import FirebaseContext from '../../context/firebase';
import { doesUsernameExist } from '../../services/firebase';
import * as ROUTES from '../../constants/routes';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

jest.mock('../../services/firebase');

describe('<SignUp />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the sign up page with a form submission and signs a user up', async () => {
    const firebase = {
      firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
          add: jest.fn(() => Promise.resolve('User added'))
        }))
      })),
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() => ({
          user: { updateProfile: jest.fn(() => Promise.resolve('I am signed up!')) }
        }))
      }))
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve(true)); // as true but inverse in the code

      await fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'xyz' } });
      await fireEvent.change(getByPlaceholderText('Full name'), {
        target: { value: 'Sebastian Stögerer' }
      });
      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'xyz@gmail.com' }
      });
      await fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1234' } });
      fireEvent.submit(getByTestId('sign-up'));

      expect(document.title).toEqual('Sign Up - Instagram');
      await expect(doesUsernameExist).toHaveBeenCalled();
      await expect(doesUsernameExist).toHaveBeenCalledWith('xyz');

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Username').value).toBe('xyz');
        expect(getByPlaceholderText('Full name').value).toBe('Sebastian Stögerer');
        expect(getByPlaceholderText('Email address').value).toBe('xyz@gmail.com');
        expect(getByPlaceholderText('Password').value).toBe('1234');
        expect(queryByTestId('error')).toBeFalsy();
      });
    });
  });

  it('renders the sign up page but an error is present (username exists)', async () => {
    const firebase = {
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() => ({
          user: {
            updateProfile: jest.fn(() => Promise.resolve({}))
          }
        }))
      }))
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve([false])); // as true but inverse in the code

      await fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'pr1mus' } });
      await fireEvent.change(getByPlaceholderText('Full name'), {
        target: { value: 'Sebastian Stögerer' }
      });
      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'stoegerer.sebastian@aon.at' }
      });
      await fireEvent.change(getByPlaceholderText('Password'), { target: { value: '1234' } });
      fireEvent.submit(getByTestId('sign-up'));

      expect(document.title).toEqual('Sign Up - Instagram');
      await expect(doesUsernameExist).toHaveBeenCalled();
      await expect(doesUsernameExist).toHaveBeenCalledWith('pr1mus');

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Username').value).toBe('');
        expect(getByPlaceholderText('Full name').value).toBe('');
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });

  it('renders the sign up page but an error is thrown', async () => {
    const firebase = {
      auth: jest.fn(() => ({
        createUserWithEmailAndPassword: jest.fn(() => ({
          user: {
            updateProfile: jest.fn(() => Promise.reject(new Error('Username is already taken!')))
          }
        }))
      }))
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <SignUp />
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      doesUsernameExist.mockImplementation(() => Promise.resolve(false)); // as true but inverse in the code

      await fireEvent.change(getByPlaceholderText('Username'), { target: { value: 'karl' } });
      await fireEvent.change(getByPlaceholderText('Full name'), {
        target: { value: 'Karl Hadwen' }
      });
      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'karl@gmail.com' }
      });
      await fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });
      fireEvent.submit(getByTestId('sign-up'));

      expect(document.title).toEqual('Sign Up - Instagram');
      await expect(doesUsernameExist).toHaveBeenCalled();
      await expect(doesUsernameExist).toHaveBeenCalledWith('karl');

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Username').value).toBe('');
        expect(getByPlaceholderText('Full name').value).toBe('');
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy();
      });
    });
  });
});
