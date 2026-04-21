/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
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
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        accent2: 'hsl(var(--accent-2))',
        gold: {
          DEFAULT: 'hsl(var(--gold))',
          foreground: 'hsl(var(--gold-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        caveat: ['Caveat', 'cursive'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(139, 69, 19, .1)',
        glow: '0 0 40px hsl(340 75% 65% / .25)',
        cake: '0 20px 60px hsl(25 65% 45% / .3)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, hsl(340 75% 65%) 0%, hsl(15 70% 70%) 100%)',
        'gradient-cake': 'linear-gradient(135deg, hsl(25 85% 75%) 0%, hsl(340 75% 65%) 50%, hsl(15 70% 70%) 100%)',
        'gradient-frosting': 'linear-gradient(180deg, hsl(340 75% 85%) 0%, hsl(340 75% 65%) 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .8s ease-out both',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
