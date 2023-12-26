import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import ChatBotScreen from '../Screens/ChatBotScreen';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState, helpToggle } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const toggleHelpSection = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    ctxDispatch({ type: 'HELPTOGGLE', payload: isOpen });
  }, [isOpen]);

  return (
    <>
      {helpToggle && (
        <div className="chatbot-visibility chatbot-sbtn rounded-2">
          <ChatBotScreen />
        </div>
      )}
      <div className={`d-flex ${theme}-footer `}>
        <div className="flex-centre w-100 ">© RoonBerg 2023</div>
        <div className="me-5 chatbot-sbtn" onClick={toggleHelpSection}>
          {t('help')}?
        </div>
      </div>
    </>
  );
}
