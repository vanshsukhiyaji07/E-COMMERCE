import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import  store  from './componets/store/Store.jsx';
import { StrictMode } from 'react';




createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  </StrictMode>
)
