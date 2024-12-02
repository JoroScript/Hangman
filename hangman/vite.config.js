import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['5left.png', '4left.png', '3left.png','2left.png','1left.png','0left.png'], // Add your image paths here
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg}'],
      },
    }),
  ],

})
