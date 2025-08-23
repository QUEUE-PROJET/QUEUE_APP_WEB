import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Inter",
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                    "Apple Color Emoji",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                ],
            },
            colors: {
                primary: {
                    50: "#f0f7ff",
                    100: "#e0efff",
                    200: "#b9ddff",
                    300: "#7cbeff",
                    400: "#369cff",
                    500: "#0078ff",
                    600: "#00509d",
                    700: "#003f88",
                    800: "#00296b",
                    900: "#001a4d",
                },
                accent: {
                    50: "#fffef0",
                    100: "#fffce0",
                    200: "#fff8b9",
                    300: "#fff17c",
                    400: "#ffe636",
                    500: "#ffd500",
                    600: "#fdc500",
                    700: "#d19e00",
                    800: "#a67c00",
                    900: "#8a6600",
                },
                qapp: {
                    "navy-deep": "#00296b",
                    "navy-medium": "#003f88",
                    "navy-light": "#00509d",
                    "gold-light": "#fdc500",
                    "gold-bright": "#ffd500",
                },
            },
            animation: {
                "fade-in-up": "fadeInUp 0.8s ease-out forwards",
                float: "float 3s ease-in-out infinite",
                glow: "glow 2s ease-in-out infinite",
                "gradient-shift": "gradientShift 3s ease infinite",
                "slide-in-left": "slideInLeft 0.6s ease-out forwards",
                "slide-in-right": "slideInRight 0.6s ease-out forwards",
                "scale-pulse": "scalePulse 2s ease-in-out infinite",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                glow: {
                    "0%, 100%": {
                        boxShadow: "0 0 20px rgba(253, 197, 0, 0.3)",
                    },
                    "50%": { boxShadow: "0 0 40px rgba(253, 197, 0, 0.6)" },
                },
                gradientShift: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                    "100%": { backgroundPosition: "0% 50%" },
                },
                slideInLeft: {
                    "0%": { opacity: "0", transform: "translateX(-50px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(50px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                scalePulse: {
                    "0%, 100%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.05)" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "qapp-primary":
                    "linear-gradient(135deg, #00296b, #003f88, #00509d)",
                "qapp-accent": "linear-gradient(135deg, #fdc500, #ffd500)",
                "qapp-hero":
                    "linear-gradient(135deg, #f0f8ff 0%, #f8ffeb 50%, #e6f3ff 100%)",
            },
            boxShadow: {
                qapp: "0 10px 40px rgba(0, 41, 107, 0.15)",
                "qapp-lg": "0 20px 60px rgba(0, 41, 107, 0.2)",
                "qapp-accent": "0 10px 40px rgba(253, 197, 0, 0.25)",
            },
        },
    },
    plugins: [],
} satisfies Config;
