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
import { Effect } from './view/Effect';
import { Info } from './view/Info';
import { AttackCalc } from './view/AtkCalc';
import { DefenseCalc } from './view/DefCalc';
import { ComfortTable } from './view/ComfortTable';
import { GameEvent, GameEventTable } from './view/Event';
import { FoodTable } from './view/FoodTable';
import { FoodPlanner } from './view/FoodPlanner';
import { Mining } from './view/Mining';
// import { Weapons } from './view/Weapons';
import { TranslationContext, useTranslation } from './effects';

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
            <Route path="/effect/:id" children={<Effect />} />
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
            <Route path="/event/:id" children={<GameEvent />} />
            <Route path="/events" children={<GameEventTable />} />
            <Route path="/mining/:objectType/:stat" children={<Mining />} />
            <Route path="/mining/:objectType" children={<Mining />} />
            <Route path="/mining" children={<Mining />} />
            {/* <Route path="/weapons" children={<Weapons />} /> */}
            <Route path="/info/:id" children={<Info />} />
          </Switch>
        </Router>
      </TranslationContext.Provider>
    </div>
  );
}

export default App;
