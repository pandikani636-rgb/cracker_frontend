/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#06070a",
        darkCard: "rgba(18, 20, 28, 0.65)",
        gold: {
          light: "#f1e5a5",
          DEFAULT: "#d4af37",
          dark: "#aa8625",
        },
        fire: {
          light: "#ff7f32",
          DEFAULT: "#ff4500",
          dark: "#c33000",
        },
        crimson: {
          light: "#ff4466",
          DEFAULT: "#dc143c",
          dark: "#a30022",
        }
      },
      fontFamily: {
        luxury: ["Outfit", "Inter", "sans-serif"],
      },
      boxShadow: {
        goldGlow: "0 0 15px rgba(212, 175, 55, 0.35)",
        fireGlow: "0 0 15px rgba(255, 69, 0, 0.4)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(to right, #ff4500, #d4af37)",
        "dark-radial": "radial-gradient(circle at center, #161824 0%, #06070a 100%)",
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 5px rgba(255, 69, 0, 0.5))' },
          '50%': { transform: 'scale(1.03)', filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
