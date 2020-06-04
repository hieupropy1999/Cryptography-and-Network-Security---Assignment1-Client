import React from 'react';
import './App.css';
import Navigation from './components/Navigation'
import Home from './containers/Home/Home';
import CheckSum from './containers/CheckSum/CheckSum'
import {Route,Switch} from 'react-router-dom';
function App() {
  return (
    <div>
      <Navigation />
      <Switch>
          <Route exact path="/check" component={CheckSum}></Route>
          <Route exact path="/" component={Home}></Route>
      </Switch>
    </div>

  );
}
export default App;
