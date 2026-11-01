import type { ReactNode } from "react";
import "../../case.css";
import { streetFonts } from "@/components/street/fonts";

/** Project pages share the street's fonts and tokens, but not its 3D scene. */
export default function CaseLayout({ children }: { children: ReactNode }) {
  return <div className={`street ${streetFonts}`}>{children}</div>;
}
