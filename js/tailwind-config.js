/* Tailwind CDN config — pecahan dari index.html (prototype, ganti build statis saat produksi) */
tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'cream-bg': '#FAF7F2',
                        'cream-surface': '#FFFFFF',
                        'cream-soft': '#F3ECE3',
                        'choco-dark': '#2A1A10',
                        'choco-medium': '#4A3324',
                        'gold-imperial': '#C5A059',
                        'gold-light': '#E8CB8B',
                        'red-maroon': '#7A1C1E',
                        'sand-light': '#E5D9CC'
                    },
                    fontFamily: {
                        'cinzel': ['Cinzel', 'serif'],
                        'playfair': ['Playfair Display', 'serif'],
                        'sans': ['Plus Jakarta Sans', 'sans-serif'],
                    },
                    boxShadow: {
                        'royal': '0 20px 40px -15px rgba(42, 26, 16, 0.07)',
                        'gold-glow': '0 10px 30px -5px rgba(197, 160, 89, 0.3)',
                        'deep-card': '0 25px 50px -12px rgba(42, 26, 16, 0.18)',
                    }
                }
            }
        }
