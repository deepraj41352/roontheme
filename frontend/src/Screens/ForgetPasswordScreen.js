import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Validations from "../Components/Validations";
import { toast } from "react-toastify";
import axios from "axios";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo, validationMsg } = state;
  const [email, setEmail] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [submited, setSubmited] = useState(false);
  const { t } = useTranslation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);
    try {
      const { data } = await axios.post("/api/user/forget-password", { email });
      toast.success(data.message);
      setSubmited(true);
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setIsSubmiting(false);
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate("/adminDashboard");
    }
  }, [userInfo, navigate]);
  return !submited ? (
    <div className="loginPage d-flex  flex-column justify-content-center align-items-center windowCal1">
      <div className="Sign-up-container-inner2 foramaxWidth py-3">
        <Row>
          <Col>
            <h4 className="mb-3 heading4">{`${t("forget")} ${t(
              "password"
            )} ?`}</h4>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="p-4 formColor">
              <Form
                onSubmit={handleSubmit}
                className="formWidth d-flex flex-column"
              >
                <Form.Label className="textLeft text-left">
                  {`E-mail ${t("address")}`}
                </Form.Label>

                <Form.Control
                  className="px-2  py-1 mb-3"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Validations type="email" value={email} />
                <Button
                  type="submit"
                  className="globalbtnColor px-5 py-1"
                  disabled={isSubmiting || validationMsg !== null}
                >
                  {isSubmiting ? `${t("submitting")}` : `${t("submit")}`}
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  ) : (
    <Container className="loginPage d-flex  flex-column justify-content-center align-items-center windowCal1">
      <div className="Sign-up-container-inner2 foramaxWidth py-3">
        <Row>
          <Col>
            <Card className="p-4 formColor">
              <h6 className="mb-4 heading4">
                {t("linkSentToRegisteredEmail")}
              </h6>

              <Button
                type="submit"
                className="globalbtnColor px-5 py-1"
                disabled={isSubmiting}
              >
                {isSubmiting ? t("resending") : t("resend")}
              </Button>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
