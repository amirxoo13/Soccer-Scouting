import type { Locale } from "@/lib/locales";
import { ar } from "./ar";
import { az } from "./az";
import { en, type Messages } from "./en";
import { fa } from "./fa";
import { ku } from "./ku";
import { tr } from "./tr";
import { ur } from "./ur";

export type { Messages };

export const messages: Record<Locale, Messages> = {
  fa,
  en,
  ar,
  tr,
  az,
  ur,
  ku,
};
