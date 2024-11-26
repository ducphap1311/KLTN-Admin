import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import FORMS_EN from "../locales/en/forms.json";
import HEADER_EN from "../locales/en/header.json";
import LISTS_EN from "../locales/en/lists.json";
import MODAL_EN from "../locales/en/modal.json";
import SIDEBAR_EN from "../locales/en/sidebar.json";
import FORMS_VI from "../locales/vi/forms.json";
import HEADER_VI from "../locales/vi/header.json";
import LISTS_VI from "../locales/vi/lists.json";
import MODAL_VI from "../locales/vi/modal.json";
import SIDEBAR_VI from "../locales/vi/sidebar.json";

export const resources = {
    en: {
        forms: FORMS_EN,
        header: HEADER_EN,
        lists: LISTS_EN,
        modal: MODAL_EN,
        sidebar: SIDEBAR_EN,
    },
    vi: {
        header: HEADER_VI,
        forms: FORMS_VI,
        lists: LISTS_VI,
        modal: MODAL_VI,
        sidebar: SIDEBAR_VI,
    },
};

const defaultNS = "forms";

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    ns: ["forms", "header", "lists", "modal", "sidebar"],
    fallbackLng: "en",
    defaultNS,
    interpolation: {
        escapeValue: false,
    },
});
