import React, { useState, useEffect, useContext } from "react";
import { Store } from "../Store";
import "../index.css";
import { useTranslation } from "react-i18next";

function Theme() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toggleState } = state;
  const theme = toggleState ? "dark" : "light";
  const [isToggled, setIsToggled] = useState(toggleState);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    if (isToggled) {
    } else {
    }
  };
  useEffect(() => {
    ctxDispatch({ type: "TOGGLE_BTN", payload: isToggled });
    localStorage.setItem("toggleState", JSON.stringify(isToggled));
  }, [isToggled]);
  const { t } = useTranslation();
  return (
    <>
      <div className="form-check form-switch" title={t("theme")}>
        <input
          className="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
          onClick={handleToggle}
          checked={theme === "dark" ? true : false}
        />
        <label
          className="form-check-label"
          htmlFor="flexSwitchCheckDefault"
        ></label>
      </div>
    </>
  );
}

export default Theme;
