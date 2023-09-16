import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        main: {
          normal: "#4f46e5",
          light: "#818cf8",
          dark: "#312e81",
          contrast: "#ffffff"
        },
        alt: {
          normal: "#2563eb",
          light: "#60a5fa",
          dark: "#1e3a8a",
          contrast: "#ffffff"
        },
        element: {
          normal: "#e5e7eb",
          light: "#f3f4f6",
          dark: "#9ca3af",
          contrast: "#020617"
        },
        tint: {
          normal: "#fafafa",
          light: "#ffffff",
          dark: "#f5f5f5",
          contrast: "#262626"
        },
        shade: {
          normal: "#1e293b",
          light: "#475569",
          dark: "#020617",
          contrast: "#ffffff"
        }
      }
    },
  },
  plugins: [],
}
export default config
