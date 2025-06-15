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
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
			screens: {
				'xs': '320px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px',
				'3xl': '1600px',
				'4xl': '1920px'
			}
		},
		screens: {
			'xs': '320px',      // Très petits mobiles
			'sm': '480px',      // Mobiles standard
			'md': '640px',      // Tablettes portrait
			'lg': '768px',      // Tablettes landscape / petits laptops
			'xl': '1024px',     // Laptops / desktops
			'2xl': '1280px',    // Grands écrans
			'3xl': '1536px',    // Très grands écrans
			'4xl': '1920px',    // Ultra wide
			'5xl': '2560px',    // 4K
			// Breakpoints spécialisés
			'mobile': {'max': '767px'},
			'tablet': {'min': '768px', 'max': '1023px'},
			'desktop': {'min': '1024px'},
			'touch': {'raw': '(pointer: coarse)'},
			'no-touch': {'raw': '(pointer: fine)'},
			'landscape': {'raw': '(orientation: landscape)'},
			'portrait': {'raw': '(orientation: portrait)'},
			'retina': {'raw': '(-webkit-min-device-pixel-ratio: 2)'},
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui'],
				display: ['Cal Sans', 'ui-sans-serif', 'system-ui'],
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
				'18': '4.5rem',
				'88': '22rem',
				'104': '26rem',
				'112': '28rem',
				'128': '32rem',
			},
			minHeight: {
				'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
				'touch-target': '44px',
			},
			minWidth: {
				'touch-target': '44px',
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
				'3d': '0 8px 24px 0 rgba(10,22,50,0.10), 0 0.5px 1.5px rgba(20,25,51,0.15)',
				'touch': '0 2px 8px rgba(0, 0, 0, 0.1)',
				'touch-active': '0 1px 4px rgba(0, 0, 0, 0.15)',
				'mobile-card': '0 4px 16px rgba(0, 0, 0, 0.08)',
				'mobile-floating': '0 8px 24px rgba(0, 0, 0, 0.12)',
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
				},
				'touch-feedback': {
					'0%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(0.95)' },
					'100%': { transform: 'scale(1)' }
				},
				'mobile-slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'mobile-fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				float: "float 4s ease-in-out infinite",
				"pulse-glow": "pulse-glow 2.5s infinite",
				"gradient-shift": "gradient-shift 6s ease infinite",
				shimmer: "shimmer 2s linear infinite",
				'touch-feedback': 'touch-feedback 0.2s ease-out',
				'mobile-slide-up': 'mobile-slide-up 0.3s ease-out',
				'mobile-fade-in': 'mobile-fade-in 0.4s ease-out',
			},
			backgroundImage: {
				"radial-gradient": "radial-gradient(circle, var(--tw-gradient-stops))",
				"shimmer": "linear-gradient(90deg, #f1f3f6 25%, #eaf2fb 50%, #f1f3f6 75%)"
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'mobile-xs': ['0.75rem', { lineHeight: '1rem' }],
				'mobile-sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'mobile-base': ['1rem', { lineHeight: '1.5rem' }],
				'mobile-lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'mobile-xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'mobile-2xl': ['1.5rem', { lineHeight: '2rem' }],
				'mobile-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
			},
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		// Plugin personnalisé pour les interactions tactiles
		function({ addUtilities }: { addUtilities: Function }) {
			const newUtilities = {
				'.touch-target': {
					minHeight: '44px',
					minWidth: '44px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				},
				'.touch-feedback': {
					'@apply transition-transform duration-200 active:scale-95': {},
				},
				'.mobile-card': {
					'@apply bg-white dark:bg-gray-800 rounded-2xl shadow-mobile-card border border-gray-100 dark:border-gray-700': {},
				},
				'.mobile-input': {
					'@apply h-12 px-4 text-base rounded-xl border-2 border-gray-200 focus:border-primary': {},
				},
				'.mobile-button': {
					'@apply h-12 px-6 text-base font-medium rounded-xl touch-target touch-feedback': {},
				},
				'.mobile-nav': {
					'@apply fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700': {},
					paddingBottom: 'env(safe-area-inset-bottom)',
				},
				'.mobile-header': {
					'@apply sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50': {},
					paddingTop: 'env(safe-area-inset-top)',
				},
				'.mobile-scroll-container': {
					'@apply overflow-y-auto overscroll-contain': {},
					paddingBottom: 'calc(env(safe-area-inset-bottom) + 4rem)',
				},
				'.desktop-only': {
					'@apply hidden lg:block': {},
				},
				'.mobile-only': {
					'@apply block lg:hidden': {},
				},
				'.tablet-only': {
					'@apply hidden md:block lg:hidden': {},
				},
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
