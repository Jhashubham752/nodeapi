import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Routes from './routes';
import { AuthContextProvider } from './context/AuthContext';

function App() {
  return (
  	  	<AuthContextProvider>
	        <Router>  
	            <Switch>
	              <Routes />
	            </Switch>
	        </Router>
      	</AuthContextProvider>
  );
}

export default App;
