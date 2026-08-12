import { Link, type LinkComponentProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

type Props = Omit<LinkComponentProps, "to"> & { to: string; children?: ReactNode };

/**
 * Link wrapper that accepts plain string paths (our i18n route map builds them
 * dynamically, so the strict literal union of generated routes doesn't apply).
 */
export function SiteLink({ to, children, ...rest }: Props) {
  const Any = Link as unknown as (p: Record<string, unknown>) => ReactNode;
  return <Any {...rest} to={to}>{children}</Any>;
}
