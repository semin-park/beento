import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import './index.css';

const loginInfoString = localStorage.getItem('beento.loginInfo');
let info = (loginInfoString !== null) ? JSON.parse(loginInfoString) : null;

ReactDOM.render(
  <React.StrictMode>
    <App loginInfo={info}/>
  </React.StrictMode>,
  document.getElementById('root')
);
