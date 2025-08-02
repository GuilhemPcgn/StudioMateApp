/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
    	container: {
    		center: true,
    		padding: '2rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		colors: {
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
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
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
    			},
    			// Nouvelles couleurs vives pour le neumorphism
    			'neu': {
    				light: '#e6e6e6',
    				dark: '#2a2a2a',
    				'light-inset': '#f0f0f0',
    				'dark-inset': '#2a2a2a',
    				shadow: {
    					light: '#d1d1d1',
    					dark: '#1a1a1a',
    					'light-highlight': '#ffffff',
    					'dark-highlight': '#4a4a4a'
    				}
    			},
    			'vivid': {
    				primary: '#667eea',
    				secondary: '#f093fb',
    				accent: '#4facfe',
    				success: '#43e97b',
    				warning: '#fa709a',
    				'primary-end': '#764ba2',
    				'secondary-end': '#f5576c',
    				'accent-end': '#00f2fe',
    				'success-end': '#38f9d7',
    				'warning-end': '#fee140'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		boxShadow: {
    			'neu-light': '2px 2px 6px rgba(0, 0, 0, 0.1), -2px -2px 6px rgba(255, 255, 255, 0.8)',
    			'neu-dark': '2px 2px 6px rgba(0, 0, 0, 0.3), -2px -2px 6px rgba(255, 255, 255, 0.1)',
    			'neu-inset-light': 'inset 2px 2px 6px rgba(0, 0, 0, 0.1), inset -2px -2px 6px rgba(255, 255, 255, 0.8)',
    			'neu-inset-dark': 'inset 2px 2px 6px rgba(0, 0, 0, 0.3), inset -2px -2px 6px rgba(255, 255, 255, 0.1)',
    			'neu-hover-light': '3px 3px 8px rgba(0, 0, 0, 0.15), -3px -3px 8px rgba(255, 255, 255, 0.9)',
    			'neu-hover-dark': '3px 3px 8px rgba(0, 0, 0, 0.4), -3px -3px 8px rgba(255, 255, 255, 0.15)',
    			'neu-button-light': '1.5px 1.5px 4px rgba(0, 0, 0, 0.1), -1.5px -1.5px 4px rgba(255, 255, 255, 0.8)',
    			'neu-button-dark': '1.5px 1.5px 4px rgba(0, 0, 0, 0.3), -1.5px -1.5px 4px rgba(255, 255, 255, 0.1)'
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
    			'float': {
    				'0%, 100%': {
    					transform: 'translateY(0px)'
    				},
    				'50%': {
    					transform: 'translateY(-10px)'
    				}
    			},
    			'pulse-glow': {
    				'0%, 100%': {
    					boxShadow: '0 0 20px rgba(102, 126, 234, 0.4)'
    				},
    				'50%': {
    					boxShadow: '0 0 40px rgba(102, 126, 234, 0.8)'
    				}
    			},
    			'gradient-shift': {
    				'0%, 100%': {
    					backgroundPosition: '0% 50%'
    				},
    				'50%': {
    					backgroundPosition: '100% 50%'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'float': 'float 3s ease-in-out infinite',
    			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
    			'gradient-shift': 'gradient-shift 3s ease infinite'
    		},
    		backgroundImage: {
    			'gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    			'gradient-secondary': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    			'gradient-accent': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    			'gradient-success': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    			'gradient-warning': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
    			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
  }