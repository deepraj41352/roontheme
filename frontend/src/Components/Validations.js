import React, { useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import { Store } from '../Store';
import { useTranslation } from 'react-i18next';

export default function Validations({ type, value }) {
  const { dispatch: ctxDispatch } = useContext(Store);
  const { t } = useTranslation();
  let validationMessage = null;
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      validationMessage = t('emailerrormsg');
    }
  }

  if (type === 'password' && value) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      validationMessage = t('passerrormsg');
    }
  }
  if (type === 'text' && value) {
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(value)) {
      validationMessage = t('mobailerrormsg');
    }
  }
  useEffect(() => {
    if (validationMessage) {
      ctxDispatch({
        type: 'VALIDATION_MSG',
        payload: validationMessage,
      });
    }
    if (!validationMessage) {
      ctxDispatch({
        type: 'VALIDATION_MSG',
        payload: null,
      });
    }
  }, [validationMessage, ctxDispatch]);

  return validationMessage ? (
    <Alert variant="danger" className="error">
      {validationMessage}
    </Alert>
  ) : null;
}
