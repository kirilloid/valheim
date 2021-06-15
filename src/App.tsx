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
import { FoodTable } from './view/FoodTable';
import { TranslationContext, useTranslation } from './translation.effect';

function App() {
  const translate = useTranslation();
  return (
    <div className="App">
      <TranslationContext.Provider value={translate}>
        <Router>
          <Search />
          <Switch>
            <Route path="/combat/:params" children={<Combat />} />
            <Route path="/combat" children={<Combat />} />
            <Route path="/food/:sort" children={<FoodTable />} />
            <Route path="/food" children={<FoodTable />} />
            <Route exact path="/ships" children={<Ship />} />
            <Route path="/obj/:id/:level" children={<GameObject />} />
            <Route path="/obj/:id" children={<GameObject />} />
            <Route path="/info/:id" children={<Info />} />
          </Switch>
        </Router>
      </TranslationContext.Provider>
    </div>
  );
}

export default App;
