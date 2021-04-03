/* eslint-disable no-undef */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import Login from '../../pages/login';
import FirebaseContext from '../../context/firebase';
import * as ROUTES from '../../constants/routes';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}));

describe('<Login />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login page with a form submission and logs the user in', async () => {
    const succeededToLogin = jest.fn(() => Promise.resolve('I am signed in!'));

    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: succeededToLogin
      }))
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
          );
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      expect(document.title).toEqual('Login - Instagram');

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'stoegerer.sebastian@aon.at' }
      });

      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '1234' }
      });

      fireEvent.submit(getByTestId('login'));

      expect(succeededToLogin).toHaveBeenCalled();
      expect(succeededToLogin).toHaveBeenCalledWith('stoegerer.sebastian@aon.at', '1234');

      await waitFor(() => {
        expect(mockHistoryPush).toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('stoegerer.sebastian@aon.at');
        expect(getByPlaceholderText('Password').value).toBe('1234');
        expect(queryByTestId('error')).toBeFalsy(); // If it doesn't find it -> throw error
      });
    });
  });

  it('renders the login page with a form submission and fails to log in the user', async () => {
    const failToLogin = jest.fn(() => Promise.reject(new Error('Cannot sign in!')));

    const firebase = {
      auth: jest.fn(() => ({
        signInWithEmailAndPassword: failToLogin
      }))
    };

    const { getByTestId, getByPlaceholderText, queryByTestId } = render(
      <Router>
        <FirebaseContext.Provider value={{ firebase }}>
          <Login />
          );
        </FirebaseContext.Provider>
      </Router>
    );

    await act(async () => {
      expect(document.title).toEqual('Login - Instagram');

      await fireEvent.change(getByPlaceholderText('Email address'), {
        target: { value: 'stoegerer.sebastian' }
      });

      await fireEvent.change(getByPlaceholderText('Password'), {
        target: { value: '1234' }
      });

      fireEvent.submit(getByTestId('login'));

      expect(failToLogin).toHaveBeenCalled();
      expect(failToLogin).toHaveBeenCalledWith('stoegerer.sebastian', '1234');

      await waitFor(() => {
        expect(mockHistoryPush).not.toHaveBeenCalledWith(ROUTES.DASHBOARD);
        expect(getByPlaceholderText('Email address').value).toBe('');
        expect(getByPlaceholderText('Password').value).toBe('');
        expect(queryByTestId('error')).toBeTruthy(); // If it doesn't find it -> throw error
      });
    });
  });
});
