import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#007BFF",
        secondary: "#00000017",
        borderPrimary: "rgba(221, 227, 227, 1)",
        textMenuColor: "rgba(56, 41, 43, 0.8)",
        blackPrimary: "#162955",
        blackSecondary: "#0F0F0F",
        grayPrimary: "#3A3939",
        commentColor: "#8D8D8D",
        textGreencolor: "#38751D",
      },
      borderRadius: {
        lg: "12px",
      },
      fontSize: {
        xxs: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
