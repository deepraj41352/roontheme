import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col, Card } from 'react-bootstrap/';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Validations from '../Components/Validations';
import { useContext, useState, useEffect } from 'react';
import { Store } from '../Store';
import { FaEye, FaRegEyeSlash } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

function RegistrationForm() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { t } = useTranslation();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { state } = useContext(Store);
  const { userInfo, validationMsg } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    if (validationMsg) {
      toast.error(`${t('setValidPassword')}`);
      setIsSubmiting(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(`${t('passwordsDoNotMatch')}`);
      setIsSubmiting(false);
      return;
    }

    try {
      const { data } = await axios.post('/api/user/signup', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });
      navigate('/');
      toast.success(t('registerConfirmationMeg'), { autoClose: 2000 });
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(`${t('registrationFailed')}`);
    } finally {
      setIsSubmiting(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  return (
    <Container className="Sign-up-container-regis d-flex  flex-column justify-content-center align-items-center">
      <div className="Sign-up-container-inner2  py-3">
        <Row>
          <Col className="p-0">
            <Card>
              <Form onSubmit={submitHandler} className="p-4 formWidth ">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box startLabel">
                    {t('firstname')}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box startLabel">
                    {t('lastname')}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="mb-1 input-box startLabel">
                    {`E-mail ${t('address')}`}
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <Validations type="email" value={email} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1 startLabel">
                    {t('password')}
                  </Form.Label>
                  <div className="Password-input-eye">
                    <div className=" rounded-2">
                      <Form.Control
                        className="pswd-input"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div
                      className="eye-bttn "
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                    </div>
                  </div>
                  <div className="validationPass mt-2">
                    <Validations
                      type="password"
                      className="validationPass"
                      value={password}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label className="mb-1 startLabel">
                    {`${t('confirm')} ${t('password')}`}
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </Form.Group>
                <Button
                  className="w-100 py-1 globalbtnColor"
                  variant="primary"
                  type="submit"
                  disabled={isSubmiting}
                >
                  {isSubmiting ? `${t('submitting')}` : `${t('submit')}`}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default RegistrationForm;
