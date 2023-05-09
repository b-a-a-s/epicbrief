import * as React from 'react';

import { ColorModeScript } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as ReactDOM from 'react-dom/client';

import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Viewport } from './components/Viewport/Viewport';
import './config';
import { App } from './containers/App/App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import theme from './theme';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ErrorBoundary>
          <Viewport>
            <App />
          </Viewport>
        </ErrorBoundary>
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
