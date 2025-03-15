import React, { useEffect } from 'react';
import './App.css';
import './assets/styles/global.css';
import withAuth from './hocs/auth/withAuth';

function App() {
  useEffect(() => {
    document.title = "Fatagram";
  }, []);

  return (
    <div className="App">
      Dashboard
    </div>
  );
}

export default withAuth(App);
