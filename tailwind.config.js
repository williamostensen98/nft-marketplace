module.exports = {
    content: ['./pages/*.js', './components/*.js'],
    theme: {
        colors: {
            transparent: 'transparent',
            current: 'currentColor',
            black: '#070707',
            white: '#ffffff',
            yellow: '#F7FA7B',
            light: '#F9FBA2',
            purple: '#3B2AAC',
            gray: '#878787',
            tahiti: '#3ab7bf',
            silver: '#ecebff',
            'bubble-gum': '#ff77e9',
            bermuda: '#78dcca',
            red: '#AC2A2A',
            green: '#3CAC2A',
        },
        fontFamily: {
            sans: ['ui-sans-serif', 'system-ui'],
            serif: ['Garamond', 'Georgia'],
            mono: ['ui-monospace', 'SFMono-Regular'],
        },
    },
    plugins: [
        // ...
        require('@tailwindcss/forms'),
        //require('@tailwindcss/aspect-ratio'),
    ],
}
