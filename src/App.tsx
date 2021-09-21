import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './css/App.css';

import { TopBar } from './view/TopBar';
import { Index } from './view/Index';
import { GameObject } from './view/GameObject';
import { Location } from './view/Location';
import { Biome } from './view/Biome';
import { Info } from './view/Info';
import { AttackCalc } from './view/AtkCalc';
import { DefenseCalc } from './view/DefCalc';
import { FoodTable } from './view/FoodTable';
import { ComfortTable } from './view/ComfortTable';
import { FoodPlanner } from './view/FoodPlanner';
import { TranslationContext, useTranslation } from './effects';
import { GameEvent, GameEventTable } from './view/Event';

function App() {
  const translate = useTranslation();
  return (
    <div className="App">
      <TranslationContext.Provider value={translate}>
        <Router>
          <TopBar />
          <Switch>
            <Route path="/" exact children={<Index />} />
            <Route path="/obj/:id/:level" children={<GameObject />} />
            <Route path="/obj/:id" children={<GameObject />} />
            <Route path="/loc/:id" children={<Location />} />
            <Route path="/biome/:id" children={<Biome />} />
            <Route path="/attack/:params" children={<AttackCalc />} />
            <Route path="/attack" children={<AttackCalc />} />
            <Route path="/defense/:params" children={<DefenseCalc />} />
            <Route path="/defense" children={<DefenseCalc />} />
            <Route path="/comfort/:params" children={<ComfortTable />} />
            <Route path="/comfort" children={<ComfortTable />} />
            <Route path="/food-nutrition/:sort" children={<FoodTable />} />
            <Route path="/food-nutrition" children={<FoodTable />} />
            <Route path="/food-planner/:params" children={<FoodPlanner />} />
            <Route path="/food-planner" children={<FoodPlanner />} />
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
