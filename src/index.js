import {StrictMode} from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <StrictMode>   // dev 환경에서는 side effect 줄이기 위해 두 번씩 실행
    <App />
  // </StrictMode>
);
