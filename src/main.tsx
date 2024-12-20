import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './api/config/state.ts';
import { HelmetProvider } from 'react-helmet-async';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    container,
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>  
          <App />
        </HelmetProvider>
      </PersistGate>
    </Provider>
  );
} else {
  root.render(
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>  
        <App />
      </HelmetProvider>
    </PersistGate>
  </Provider>
  )
}

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <Provider store={store}>
//     <PersistGate loading={null} persistor={persistor}>
//       <HelmetProvider>  
//         <App />
//       </HelmetProvider>
//     </PersistGate>
//   </Provider>
// );
