import React, { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import {
  Button,
  Card,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from 'react-bootstrap';
import Validations from '../Components/Validations';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { CardHeader } from '@mui/material';
import { CCardBody, CCardFooter } from '@coreui/react';
import { useEffect } from 'react';

export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, validationMsg } = state;
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [status, setStatus] = useState();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const confirmUser = async () => {
      try {
        const response = await axios.post(`/api/user/massege`, { token });
        setStatus(response.status);
      } catch (error) {
        console.error(error.response.status);
        setStatus(error.response.status);
        setConfirmationMessage('you are already confirmed.');
      } finally {
        setIsLoading(false); // Set loading to false when the request is completed
      }
    };

    confirmUser();
  }, [token]);

  const handleConfirm = async () => {
    setIsSubmiting(true);

    try {
      const { data } = await axios.post(`/api/user/confirm`, {
        token,
      });
      console.log(data);
      toast.success(data.message);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleCancel = () => {
    navigate('/registration');
  };
  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  return (
    <>
      <div className="d-flex flex-column align-items-center justify-content-center confirmRHeight">
        {isLoading ? ( // Show loader if still loading
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Card className="text-center">
            {status && status === 400 ? (
              <CCardBody>
                <p>{confirmationMessage}</p>
              </CCardBody>
            ) : (
              <>
                <CardHeader>Confirm Action</CardHeader>
                <CCardBody>
                  <p>Are you sure you want to register?</p>
                </CCardBody>
                <CCardFooter>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="m-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="m-1"
                    variant="primary"
                    type="button"
                    disabled={isSubmiting}
                    onClick={handleConfirm}
                  >
                    Confirm
                  </Button>
                </CCardFooter>
              </>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
