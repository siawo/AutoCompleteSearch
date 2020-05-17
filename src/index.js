import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AutoBox from './Components/AutoBox';

ReactDOM.render(
  <React.StrictMode>
    <AutoBox
      baseURL='https://api.github.com'
      relativePath='/search/users'
      searchParam='q'
      listLength='5'
      addString='+in:login'
      dataAccessor={datum => datum.login}
    />
  </React.StrictMode>,
  document.getElementById('root')
);
