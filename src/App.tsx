import React, { useLayoutEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './css/App.css';

import { TopBar } from './view/parts/TopBar';
import { Home } from './view/pages/Home';
import { GameObject } from './view/objects/GameObject';
import { Location } from './view/Location';
import { Biome } from './view/Biome';
import { Effect } from './view/objects/Effect';
import { Info } from './view/Info';
import { AttackCalc } from './view/pages/AtkCalc';
import { DefenseCalc } from './view/pages/DefCalc';
import { ComfortTable } from './view/pages/ComfortTable';
import { GameEvent, GameEventTable } from './view/pages/Event';
import { Weather } from './view/pages/Weather';
import { FoodTable } from './view/pages/FoodTable';
import { FoodPlanner } from './view/pages/FoodPlanner';
import { Mining } from './view/pages/Mining';
import { WorldEditor } from './view/world';
import { PlayerEditor } from './view/player';
// import { Weapons } from './view/Weapons';
import { TranslationContext, useGlobalState, useTranslation } from './effects';
import { WorldGenerator } from './view/pages/WorldGenerator';

function App() {
  const translate = useTranslation();
  const [theme] = useGlobalState('theme');
  useLayoutEffect(() => {
    document.documentElement.className = `theme--${theme}`;
  }, [theme]);
  return (
    <div className="App">
      <TranslationContext.Provider value={translate}>
        <Router>
          <TopBar />
          <Switch>
            <Route path="/" exact children={<Home />} />
            <Route path="/obj/:id/:level" children={<GameObject />} />
            <Route path="/obj/:id" children={<GameObject />} />
            <Route path="/loc/:id" children={<Location />} />
            <Route path="/biome/:id" children={<Biome />} />
            <Route path="/event/:id" children={<GameEvent />} />
            <Route path="/events" children={<GameEventTable />} />
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
            <Route path="/weather" children={<Weather />} />
            <Route path="/mining/:objectType/:stat" children={<Mining />} />
            <Route path="/mining/:objectType" children={<Mining />} />
            <Route path="/mining" children={<Mining />} />
            <Route path="/world-gen" children={<WorldGenerator />} />
            {/* <Route path="/weapons" children={<Weapons />} /> */}
            <Route path="/world-edit" children={<WorldEditor />} />
            <Route path="/player-edit" children={<PlayerEditor />} />
            <Route path="/info/:id" children={<Info />} />
          </Switch>
        </Router>
      </TranslationContext.Provider>
    </div>
  );
}

export default App;
