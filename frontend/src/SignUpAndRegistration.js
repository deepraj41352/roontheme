import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RegistrationForm from './Screens/RegistrationScreen';
import SignUpForm from './Screens/SignInScreen';

function SignUpAndRegistration() {
  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn);

  const [register, setRegister] = useState(true ? 'register' : 'login');
  return (
    <div>
      <div className="register-area ptb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-none-img">
              <div className="register-img">
                <img className="w-100" src="logdash.png" alt="Image" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="register-form">
                {register == 'register' ? (
                  <motion.h2
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, x: 0 }}
                    exit={{ scale: 0 }}
                  >
                    Create your account
                  </motion.h2>
                ) : (
                  <motion.h2
                    initial={{ scale: 0 }}
                    animate={{ scale: 0.9, x: 0 }}
                    exit={{ scale: 1 }}
                  >
                    Sign in to RoonBerg
                  </motion.h2>
                )}

                <ul
                  className="register-tab nav nav-tabs justify-content-between"
                  data-ison={isOn}
                  onClick={toggleSwitch}
                >
                  <li className="nav-item" role="presentation">
                    <motion.button
                      className={`nav-link ${
                        register == 'register' ? 'active' : ''
                      }`}
                      onClick={() => setRegister('register')}
                      whileHover={{
                        scale: 1.3,
                        transition: { duration: 1 },
                      }}
                      whileTap={{ scale: 0.8 }}
                      layout
                      transition={{
                        type: 'spring',
                      }}
                    >
                      Register
                    </motion.button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <motion.button
                      className={`nav-link ${
                        register == 'login' ? 'active' : ''
                      }`}
                      type="button"
                      onClick={() => setRegister('login')}
                      whileHover={{
                        scale: 1.3,
                        transition: { duration: 1 },
                      }}
                      whileTap={{ scale: 0.8 }}
                      transition={{
                        type: 'spring',
                      }}
                    >
                      Login
                    </motion.button>
                  </li>
                </ul>

                <div className="tab-content" id="myTabContent">
                  {register === 'register' ? (
                    <RegistrationForm />
                  ) : (
                    <SignUpForm />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpAndRegistration;
