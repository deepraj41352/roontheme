import React, { useContext, useEffect } from 'react';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';

export default function LogoutRedirectRoute() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    navigate('/');
  }, [userInfo]);

  return (
    <div>
      <h1>404 Not Found</h1>
    </div>
  );
}
