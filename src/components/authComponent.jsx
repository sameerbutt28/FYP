import React from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../store/authSlice'; // Adjust the import path
import { GoogleLogin } from 'react-google-login'; // Make sure to install this package

const AuthComponent = () => {
  const dispatch = useDispatch();

  const handleLoginSuccess = (response) => {
    const { profileObj, googleId } = response; // Extract user profile and ID
    // Dispatch the loginUser action with user data
    dispatch(loginUser({
      id: googleId,
      name: profileObj.name,
      email: profileObj.email,
    }));
  };

  const handleLoginFailure = (response) => {
    console.error("Login failed: ", response);
  };

  const handleLogout = () => {
    // Call the logoutUser action when the user logs out
    dispatch(logoutUser());
    // Optionally handle Google logout as well
  };

  return (
    <div>
      <GoogleLogin
        clientId="YOUR_CLIENT_ID.apps.googleusercontent.com" // Replace with your Google client ID
        buttonText="Login with Google"
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
        cookiePolicy={'single_host_origin'}
      />
      <button onClick={handleLogout}>Logout</button> {/* Add a logout button */}
    </div>
  );
};

export default AuthComponent;
