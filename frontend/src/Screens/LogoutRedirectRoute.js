import React, { useContext, useEffect } from "react";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LogoutRedirectRoute() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const { t } = useTranslation();

  useEffect(() => {
    navigate("/");
  }, [userInfo]);

  return (
    <div>
      <h1>{`404 ${t("notFound")}`}</h1>
    </div>
  );
}
