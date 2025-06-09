import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          background: "#FFFFFF",
          foreground: "#1E1E1E",
          content1: "#F8F9FA",
          content2: "#F1F3F4",
          content3: "#E8EAED",
          content4: "#DADCE0",
          default: {
            50: "#F8F9FA",
            100: "#F1F3F4",
            200: "#E8EAED",
            300: "#DADCE0",
            400: "#BDC1C6",
            500: "#9AA0A6",
            600: "#80868B",
            700: "#5F6368",
            800: "#3C4043",
            900: "#202124",
            DEFAULT: "#9AA0A6",
            foreground: "#1E1E1E"
          },
          primary: {
            50: "#E3F2FD",
            100: "#BBDEFB",
            200: "#90CAF9",
            300: "#64B5F6",
            400: "#42A5F5",
            500: "#007ACC",
            600: "#0066B3",
            700: "#005299",
            800: "#003D80",
            900: "#002966",
            DEFAULT: "#007ACC",
            foreground: "#FFFFFF"
          },
          secondary: {
            50: "#F3E5F5",
            100: "#E1BEE7",
            200: "#CE93D8",
            300: "#BA68C8",
            400: "#AB47BC",
            500: "#9C27B0",
            600: "#8E24AA",
            700: "#7B1FA2",
            800: "#6A1B9A",
            900: "#4A148C",
            DEFAULT: "#9C27B0",
            foreground: "#FFFFFF"
          },
          success: {
            50: "#E8F5E8",
            100: "#C8E6C9",
            200: "#A5D6A7",
            300: "#81C784",
            400: "#66BB6A",
            500: "#4CAF50",
            600: "#43A047",
            700: "#388E3C",
            800: "#2E7D32",
            900: "#1B5E20",
            DEFAULT: "#4CAF50",
            foreground: "#FFFFFF"
          },
          warning: {
            50: "#FFF8E1",
            100: "#FFECB3",
            200: "#FFE082",
            300: "#FFD54F",
            400: "#FFCA28",
            500: "#FFC107",
            600: "#FFB300",
            700: "#FFA000",
            800: "#FF8F00",
            900: "#FF6F00",
            DEFAULT: "#FFC107",
            foreground: "#1E1E1E"
          },
          danger: {
            50: "#FFEBEE",
            100: "#FFCDD2",
            200: "#EF9A9A",
            300: "#E57373",
            400: "#EF5350",
            500: "#F44336",
            600: "#E53935",
            700: "#D32F2F",
            800: "#C62828",
            900: "#B71C1C",
            DEFAULT: "#F44336",
            foreground: "#FFFFFF"
          },
          divider: "#E8EAED",
          focus: "#007ACC"
        }
      },
      dark: {
        colors: {
          background: "#1E1E1E",
          foreground: "#CCCCCC",
          content1: "#252526",
          content2: "#2D2D30",
          content3: "#383838",
          content4: "#404040",
          default: {
            50: "#F8F8F8",
            100: "#F0F0F0",
            200: "#E0E0E0",
            300: "#C0C0C0",
            400: "#A0A0A0",
            500: "#808080",
            600: "#606060",
            700: "#404040",
            800: "#303030",
            900: "#1E1E1E",
            DEFAULT: "#808080",
            foreground: "#CCCCCC"
          },
          primary: {
            50: "#E3F2FD",
            100: "#BBDEFB",
            200: "#90CAF9",
            300: "#64B5F6",
            400: "#42A5F5",
            500: "#007ACC",
            600: "#0E7DB8",
            700: "#1177BB",
            800: "#1177BB",
            900: "#1177BB",
            DEFAULT: "#007ACC",
            foreground: "#FFFFFF"
          },
          secondary: {
            50: "#F3E5F5",
            100: "#E1BEE7",
            200: "#CE93D8",
            300: "#BA68C8",
            400: "#AB47BC",
            500: "#C586C0",
            600: "#C586C0",
            700: "#C586C0",
            800: "#C586C0",
            900: "#C586C0",
            DEFAULT: "#C586C0",
            foreground: "#1E1E1E"
          },
          success: {
            50: "#E8F5E8",
            100: "#C8E6C9",
            200: "#A5D6A7",
            300: "#81C784",
            400: "#66BB6A",
            500: "#4EC9B0",
            600: "#4EC9B0",
            700: "#4EC9B0",
            800: "#4EC9B0",
            900: "#4EC9B0",
            DEFAULT: "#4EC9B0",
            foreground: "#1E1E1E"
          },
          warning: {
            50: "#FFF8E1",
            100: "#FFECB3",
            200: "#FFE082",
            300: "#FFD54F",
            400: "#FFCA28",
            500: "#DCDCAA",
            600: "#DCDCAA",
            700: "#DCDCAA",
            800: "#DCDCAA",
            900: "#DCDCAA",
            DEFAULT: "#DCDCAA",
            foreground: "#1E1E1E"
          },
          danger: {
            50: "#FFEBEE",
            100: "#FFCDD2",
            200: "#EF9A9A",
            300: "#E57373",
            400: "#EF5350",
            500: "#F48771",
            600: "#F48771",
            700: "#F48771",
            800: "#F48771",
            900: "#F48771",
            DEFAULT: "#F48771",
            foreground: "#FFFFFF"
          },
          divider: "#404040",
          focus: "#007ACC"
        }
      }
    }
  })],
}
