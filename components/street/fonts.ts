import { Golos_Text, Literata } from "next/font/google";

/**
 * The street design: Literata for the voice (a reading serif with optical sizes, made for long
 * text on screens) and Golos Text for everything that is a label or a number.
 */
const literata = Literata({
  subsets: ["latin", "latin-ext", "cyrillic"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-literata",
  display: "swap",
});
const golos = Golos_Text({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-golos", display: "swap" });

export const streetFonts = `${literata.variable} ${golos.variable}`;
