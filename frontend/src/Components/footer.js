import React, { useContext, useState } from 'react';
import { Store } from '../Store';
import ChatBotScreen from '../Screens/ChatBotScreen';

export default function Footer() {
  const { state } = useContext(Store);
  const { toggleState } = state;
  const theme = toggleState ? 'dark' : 'light';
  const [isOpen, setIsOpen] = useState(false);
  // return <div className={`${theme}-footer`}>© RoonBerg 2023</div>;
  return (
    <>
      {isOpen && (
        <div className="chatbot-visibility chatbot-sbtn rounded-2">
          <ChatBotScreen />
        </div>
      )}
      <div className={`d-flex ${theme}-footer `}>
        <div className="flex-centre w-100 ">© RoonBerg 2023</div>
        <div className="me-5 chatbot-sbtn" onClick={() => setIsOpen(!isOpen)}>
          Help?
        </div>
      </div>
    </>
  );
}
