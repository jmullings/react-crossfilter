import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './stylesheets/index.scss';

import newData from '../public/data/evenjoins_data.js';

ReactDOM.render(
  <App data={newData} settings={{pageView: "analytics"}}/>, document.getElementById('root')
);


// GET YOUR DATA
// import axios from 'axios'
// axios.get(`/api/data`)
//     .then(resp => {
//         let newData = resp.data
//     })