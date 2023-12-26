import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Store } from "../Store";
import Dropdown from "react-bootstrap/Dropdown";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { languageName } = state;
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    ctxDispatch({ type: "LANGUAGE_BTN", payload: language });
    localStorage.setItem("languageName", JSON.stringify(language));
  };
  const { t } = useTranslation();
  return (
    <div title={t("language")}>
      <Dropdown>
        <Dropdown.Toggle
          style={{ border: "none", outline: "none" }}
          variant="white"
          id="dropdown-basic"
        >
          {languageName == "en" ? (
            <img src="/UsaFlag.png" style={{ height: "26px" }} />
          ) : (
            <img src="/netherlandsFlag.png" style={{ height: "26px" }} />
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => changeLanguage("en")}>
            English
          </Dropdown.Item>
          <Dropdown.Item onClick={() => changeLanguage("nl")}>
            Dutch
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
