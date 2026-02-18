import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["id", "en"],
  defaultLocale: "id",
  localeDetection: false,
  // Will be merged with the defaults
  localeCookie: {
    // Custom cookie name
    name: "SPEAD_LOCALE",
    // Expire in one year
    maxAge: 60 * 60 * 24 * 365,
  },
});
