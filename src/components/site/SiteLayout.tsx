import type { ReactNode } from "react";
import type { Lang } from "@/i18n";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteLayout({
  lang,
  children,
  darkToggle = false,
}: {
  lang: Lang;
  children: ReactNode;
  darkToggle?: boolean;
}) {
  return (
    <>
      <Header lang={lang} dark={darkToggle} />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  );
}
