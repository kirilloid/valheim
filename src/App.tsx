import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './css/App.css';

import { Search } from './view/Search';
import { GameObject } from './view/GameObject';
import { Info } from './view/Info';
import { AttackCalc } from './view/AtkCalc';
import { DefenseCalc } from './view/DefCalc';
import { FoodTable } from './view/FoodTable';
import { Location } from './view/Location';
import { Biome } from './view/Biome';
import { TranslationContext, useTranslation } from './effects';
import { GameEvent, GameEventTable } from './view/Event';
import { ComfortTable } from './view/ComfortTable';

function App() {
  const translate = useTranslation();
  return (
    <div className="App">
      <TranslationContext.Provider value={translate}>
        <Router>
          <Search />
          <Switch>
            <Route path="/obj/:id/:level" children={<GameObject />} />
            <Route path="/obj/:id" children={<GameObject />} />
            <Route path="/loc/:id" children={<Location />} />
            <Route path="/attack/:params" children={<AttackCalc />} />
            <Route path="/attack" children={<AttackCalc />} />
            <Route path="/comfort" children={<ComfortTable />} />
            <Route path="/defense/:params" children={<DefenseCalc />} />
            <Route path="/defense" children={<DefenseCalc />} />
            <Route path="/food/:sort" children={<FoodTable />} />
            <Route path="/food" children={<FoodTable />} />
            <Route path="/biome/:id" children={<Biome />} />
            <Route path="/info/:id" children={<Info />} />
            <Route path="/event/:id" children={<GameEvent />} />
            <Route path="/events" children={<GameEventTable />} />
          </Switch>
        </Router>
      </TranslationContext.Provider>
    </div>
  );
}

export default App;
