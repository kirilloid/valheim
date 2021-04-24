import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './css/App.css';

import { Search } from './view/Search';
import { Ship } from './view/Ship';
import { GameObject } from './view/GameObject';
import { Info } from './view/Info';
import { Combat } from './view/Combat';


function App() {
  return (
    <div className="App">
      <Router>
        <Search />
        <Switch>
          <Route exact path="/combat" children={<Combat />} />
          <Route exact path="/ships" children={<Ship />} />
          <Route path="/obj/:id" children={<GameObject />} />
          <Route path="/info/:id" children={<Info />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
