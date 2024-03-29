import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Validations from "../Components/Validations";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../Store";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ResetPasswordScreen() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { state } = useContext(Store);
  const { userInfo, validationMsg } = state;
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmiting(true);

    if (validationMsg) {
      toast.error(t("setValidPassword"));
      setIsSubmiting(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("passwordsDoNotMatch"));
      setIsSubmiting(false);
      return;
    }
    try {
      const { data } = await axios.post("/api/user/reset-password", {
        password,
        token,
      });
      toast.success(data.message);
      navigate("/");
    } catch (err) {
      setError(t("An Error Ocurred"));
    } finally {
      setIsSubmiting(false);
    }
  };
  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [userInfo, navigate]);

  return (
    <>
      {error ? (
        <div>{error}</div>
      ) : (
        <div className="loginPage d-flex  flex-column justify-content-center align-items-center windowCal1">
          <div className="Sign-up-container-inner2 foramaxWidth py-3">
            <Row>
              <Col>
                <h4 className="mb-3 heading4">{`${t("reset")} ${t(
                  "password"
                )}`}</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card className="formColor">
                  <Form
                    onSubmit={submitHandler}
                    className=" p-4 d-flex flex-column"
                  >
                    <div className="mb-2">
                      <Form.Label className="textLeft text-left startLabel">
                        {t("password")}
                      </Form.Label>
                      <div className="Password-input-eye mb-2">
                        <div className=" rounded-2">
                          <Form.Control
                            id="password"
                            value={password}
                            className="pswd-input"
                            type={showPassword ? "text" : "password"}
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
                    </div>
                    <div className="mb-2">
                      <Form.Label className="textLeft text-left startLabel">
                        {`${t("confirm")} ${t("password")}`}
                      </Form.Label>
                      <div className="Password-input-eye mb-2">
                        <div className=" rounded-2">
                          <Form.Control
                            id="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pswd-input"
                            type={showPassword ? "text" : "password"}
                            required
                          />
                        </div>
                        <div
                          className="eye-bttn "
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEye /> : <FaRegEyeSlash />}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="globalbtnColor px-2 py-1"
                      disabled={isSubmiting}
                    >
                      {isSubmiting ? `${t("submitting")}` : `${t("submit")}`}
                    </Button>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </>
  );
}
