import { createContext } from 'react';

import type { GameSettings } from '../types/GameSettings';

import { gameSettings } from '../data/game-settings';

export const GameSettingsContext = createContext<GameSettings>(gameSettings);
