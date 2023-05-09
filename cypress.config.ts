import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
  // component: {
  // setupNodeEvents(on, config) {},
  // specPattern: "src/**/*.test.{js,ts,jsx,tsx}",
  // },

  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});

// const { defineConfig } = require('cypress')

// module.exports = defineConfig({
// })
