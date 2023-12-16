import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SignUpAndRegistration from '../../SignUpAndRegistration';
import ConfirmRegistration from '../../Screens/ConfirmRegistration';
import RegistrationForm from '../../Screens/RegistrationScreen';
import ForgetPassword from '../../Screens/ForgetPasswordScreen';
import ResetPasswordScreen from '../../Screens/ResetPasswordScreen';
import LogoutRedirectRoute from '../../Screens/LogoutRedirectRoute';

export default function HomeRouting() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignUpAndRegistration />} />
        <Route path="/confirm/:token" element={<ConfirmRegistration />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordScreen />}
        />
        <Route path="/*" element={<LogoutRedirectRoute />} />
      </Routes>
    </>
  );
}
