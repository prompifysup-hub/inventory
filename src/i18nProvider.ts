import englishMessages from "./i18n/en";
import polyglotI18nProvider from "ra-i18n-polyglot";

export const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }], {
  allowMissing: true,
});
