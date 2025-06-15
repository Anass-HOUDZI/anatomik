import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'xs': '400px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px',
				'3xl': '1600px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui'],
				display: ['Cal Sans', 'ui-sans-serif', 'system-ui'],
			},
			colors: {
				gray: {
					100: "#f8f9fa",
					200: "#f1f3f6",
					300: "#e4e7ec",
					500: "#636b7c",
					700: "#282b35",
					900: "#171924"
				},
				blue: {
					50: "#eaf2fb",
					100: "#c7dcfa",
					400: "#4386f9",
					600: "#2563eb",
					700: "#264ea4",
					900: "#1d315b"
				},
				accent: "#afecfe",
				shimmer: "#fff6e5",
				success: "#31cf6e",
				warning: "#ffe569",
				error: "#fd4d4d",
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'md-soft': '0 4px 32px rgba(50,68,130,0.10)',
				'3d': '0 8px 24px 0 rgba(10,22,50,0.10), 0 0.5px 1.5px rgba(20,25,51,0.15)'
			},
			blur: {
				xs: '2px',
				xl: '32px'
			},
			backdropBlur: {
				md: '10px',
				xl: '32px'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				float: {
					"0%,100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"pulse-glow": {
					"0%,100%": { boxShadow: "0 0 30px 6px #4386f966" },
					"50%": { boxShadow: "0 0 50px 15px #4386f999" }
				},
				"gradient-shift": {
					"0%,100%": { backgroundPosition: "0% 50%" },
					"50%": { backgroundPosition: "100% 50%" }
				},
				shimmer: {
					"0%": { backgroundPosition: "-700px 0" },
					"100%": { backgroundPosition: "700px 0" }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				float: "float 4s ease-in-out infinite",
				"pulse-glow": "pulse-glow 2.5s infinite",
				"gradient-shift": "gradient-shift 6s ease infinite",
				shimmer: "shimmer 2s linear infinite",
			},
			backgroundImage: {
				"radial-gradient": "radial-gradient(circle, var(--tw-gradient-stops))",
				"shimmer": "linear-gradient(90deg, #f1f3f6 25%, #eaf2fb 50%, #f1f3f6 75%)"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
