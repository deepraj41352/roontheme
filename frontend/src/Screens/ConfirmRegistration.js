import React, { useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { CardHeader } from "@mui/material";
import { CCardBody, CCardFooter } from "@coreui/react";
import { useEffect } from "react";
import ThreeLoader from "../Util/threeLoader";
import { useTranslation } from "react-i18next";

export default function ConfirmRegistration() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [status, setStatus] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  useEffect(() => {
    const confirmUser = async () => {
      try {
        const response = await axios.post(`/api/user/massege`, { token });
        setStatus(response.status);
      } catch (error) {
        setStatus(error.response.status);
        setConfirmationMessage(`${t("youAreAlreadyConfirmed")}`);
      } finally {
        setIsLoading(false);
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
      toast.success(data.message);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  const handleCancel = () => {
    navigate("/registration");
  };
  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [userInfo, navigate]);

  return (
    <>
      <div className="loginPage d-flex  flex-column justify-content-center align-items-center windowCal1">
        {isLoading ? (
          <ThreeLoader />
        ) : (
          <Card className="Sign-up-container-inner2 text-center foramaxWidth">
            {status && status === 400 ? (
              <CCardBody>
                <spam>{confirmationMessage}</spam>
              </CCardBody>
            ) : (
              <>
                <CardHeader>{`${t("confirm")} ${t("action")}`}</CardHeader>
                <CCardBody>
                  <p>{`${t("areYouSureToRegister")}`}</p>
                </CCardBody>
                <CCardFooter>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="m-1 globalbtnColor"
                  >
                    {`${t("cancel")}`}
                  </Button>
                  <Button
                    className="m-1 globalbtnColor"
                    variant="primary"
                    type="button"
                    disabled={isSubmiting}
                    onClick={handleConfirm}
                  >
                    {`${t("confirm")}`}
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
