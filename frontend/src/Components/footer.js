import React, { useContext } from 'react';
import { Store } from '../Store';

export default function Footer() {
  const { state } = useContext(Store);
  const { toggleState } = state;
  const theme = toggleState ? 'dark' : 'light';
  return <div className={`${theme}-footer`}>© RoonBerg 2023</div>;
}
