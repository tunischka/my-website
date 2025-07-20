/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",   // public klasöründeki tüm HTML’ler
    "./src/**/*.{js,ts}"    // ileride JS eklersen diye
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: { tunaBlue: "#2563eb" }
    },
  },
  plugins: [],
}
