import React, { useLayoutEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import './css/App.css';

import { defCalc, offCalc, foodTable, foodPlanner, mining, comfort, skills } from './state';

import { TopBar } from './view/parts/TopBar';
import { Home } from './view/pages/Home';
import { GameObject } from './view/objects/GameObject';
import { Location } from './view/Location';
import { Biome } from './view/Biome';
import { Effect } from './view/objects/Effect';
import { Info } from './view/Info';
import { AttackCalc } from './view/pages/AtkCalc';
import { DefenseCalc } from './view/pages/DefCalc';
import { Skills } from './view/pages/Skills';
import { ComfortTable } from './view/pages/ComfortTable';
import { GameEvent, GameEventFilterTable } from './view/pages/Event';
import { Weather } from './view/pages/Weather';
import { FoodTable } from './view/pages/FoodTable';
import { FoodPlanner } from './view/pages/FoodPlanner';
import { Mining } from './view/pages/Mining';
import { WorldEditor } from './view/world';
import { WorldMeta } from './view/WorldMeta';
import { FwlRecovery } from './view/world/FwlRecovery';
import { PlayerEditor } from './view/player';
// import { Weapons } from './view/pages/Weapons';
import { TranslationContext, GameSettingsContext, useGlobalState, useTranslation } from './effects';
import { gameSettings } from './data/game-settings';
import { WorldGenerator } from './view/pages/WorldGenerator';
import { About } from './view/pages/About';
import { Mods } from './view/pages/Mods';
import { Loader } from './view/parts/Loader';

function App() {
  const translate = useTranslation();
  const [theme] = useGlobalState('theme');
  useLayoutEffect(() => {
    document.documentElement.className = `theme--${theme}`;
  }, [theme]);
  return (
    <div className="App">
      <TranslationContext.Provider value={translate}>
      <GameSettingsContext.Provider value={gameSettings}>
        <Router>
          <TopBar />
          <Switch>
            <Route path="/" exact children={<Home />} />
            <Route path="/obj/:id/:level" children={<GameObject />} />
            <Route path="/obj/:id" children={<GameObject />} />
            <Route path="/loc/:id" children={<Location />} />
            <Route path="/biome/:id" children={<Biome />} />
            <Route path="/event/:id" children={<GameEvent />} />
            <Route path="/events" children={<GameEventFilterTable />} />
            <Route path="/effect/:id" children={<Effect />} />
            <Route path={`/${offCalc}/:params`} children={<AttackCalc />} />
            <Route path={`/${offCalc}`} children={<AttackCalc />} />
            <Route path={`/${defCalc}/:params`} children={<DefenseCalc />} />
            <Route path={`/${defCalc}`} children={<DefenseCalc />} />
            <Route path={`/${comfort}/:params`} children={<ComfortTable />} />
            <Route path={`/${comfort}`} children={<ComfortTable />} />
            <Route path={`/${foodTable}/:sort`} children={<FoodTable />} />
            <Route path={`/${foodTable}`} children={<FoodTable />} />
            <Route path={`/${foodPlanner}/:params`} children={<FoodPlanner />} />
            <Route path={`/${foodPlanner}`} children={<FoodPlanner />} />
            <Route path="/weather" children={<Weather />} />
            <Route path={`/${mining}/:objectType/:stat`} children={<Mining />} />
            <Route path={`/${mining}/:objectType`} children={<Mining />} />
            <Route path={`/${mining}`} children={<Mining />} />
            <Route path="/world-gen/:seed" children={<WorldGenerator />} />
            <Route path="/world-gen" children={<WorldGenerator />} />
            <Route path={`/${skills}/:skill/:level`} children={<Skills />} />
            <Route path={`/${skills}/:skill`} children={<Skills />} />
            <Route path={`/${skills}`} children={<Skills />} />
            {/* <Route path="/weapons" children={<Weapons />} /> */}
            <Route path="/world-edit" children={<WorldEditor />} />
            <Route path="/world-meta" children={<WorldMeta />} />
            <Route path="/world-meta-recovery" children={<FwlRecovery />} />
            <Route path="/player-edit" children={<PlayerEditor />} />
            <Route path="/about" children={<About />} />
            <Route path="/mods" children={<Mods />} />
            <Route path="/info/:id" children={<Info />} />
            <Route path="/test" children={<Loader />} />
          </Switch>
        </Router>
      </GameSettingsContext.Provider>
      </TranslationContext.Provider>
    </div>
  );
}

export default App;
