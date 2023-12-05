import React, { createContext, useReducer } from 'react';

export const Store = createContext();

const initialValue = {
  validationMsg: null,
  NotificationData: [],
  toggleState: localStorage.getItem('toggleState')
    ? JSON.parse(localStorage.getItem('toggleState'))
    : null,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
  categoriesDatatrue: false,
  projectDatatrue: false,
  contractorDatatrue: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_UPDATE':
      return { ...state, userInfo: action.payload };
    case 'VALIDATION_MSG':
      return { ...state, validationMsg: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
      };
    case 'TOGGLE_BTN':
      return {
        ...state,
        toggleState: action.payload,
      };
    case 'NOTIFICATION':
      return {
        ...state,
        NotificationData: [...state.NotificationData, action.payload],
      };

    case 'NOTIFICATION-NULL':
      return {
        ...state,
        NotificationData: [],
      };
    case 'CATEGORIESDATA':
      return { ...state, categoriesDatatrue: action.payload };
    case 'PROJECTDATA':
      return { ...state, projectDatatrue: action.payload };
    case 'CONTRACTORDATA':
      return { ...state, contractorDatatrue: action.payload };
    case 'SIDEBAR':
      return { ...state, sidebar: action.payload };
    default:
      return state;
  }
};

export default function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
