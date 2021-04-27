import { resources } from './resources';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { arrows } from './arrows';
import { Item } from '../types';
import { tools } from './tools';

const data: Record<string, Item> = {};
resources.forEach(r => data[r.id] = r);
weapons.forEach(w => data[w.id] = w);
armors.forEach(a => data[a.id] = a);
arrows.forEach(a => data[a.id] = a);
tools.forEach(t => data[t.id] = t);

export default data;

/*

skeletal remains (buried): 50% silver necklace

mudpile (beacon)
drop: 30%
- 100 IronScrap
- 1 WitheredBone
beaconRange: 25

mudpile
drop: 20%
- 5 IronScrap
- 1 WitheredBone
- 1 LeatherScrap

# any tree stubs
- hp: 80
- drop: 100% 2 of [1 Wood]

# any log2
- dmg: 50 blunt, 30 chop

# beech small
- hp: 20
- drop: 100% 2-3 of [10: 1 Wood, 2: 1-2 Resin]

# beech
- hp: 80
- drop: 50% 2 of [4: 2-3 BeechSeeds, 1: 1-2 Feathers, 1: 1-2 Resin]

# beech log2
- hp: 60
- drop: 100% 10 of [1 Wood]

# fir tree
- hp: 80
- drop: 50% 1-2 of [4: 1 FirCone, 1: 1 Feathers, 1: 1 Resin]
        100% 1 of [fir log]

# fir log
- hp: 60
- drop: 

# fir log2
- hp: 40
- dmg: 50 blunt, 30 chop
- drop: 100% 10 of [1 Wood]

# birch
- hp: 80
- drop: 30% 1 of [1 Resin]
       100% 2 of [1 birch log]

# birch log2
- hp: 60
- drop: 100% 10 of [1 Wood, 1 FineWood]

# oak
- hp: 200
- drop: oak log

# oak log
- hp: 160
- drop: 2 oak log2

# oak log2
- hp: 140
- drop: 100% 25 of [1 Wood, 1 FineWood]

# pine log2
- hp: 40
- drop: 100% 15 of [1 Wood, 1 RoundLog]

HeathRockPillar gives 350-400 stone

silver_vein_frac:
  children: 132
  hp: 50
  minToolTier: 0
  drops: 2-3 of 1 SilverOre : 2 Stone

rock4_copper_frac:
  children: 132
  hp: 40
  minToolTier: 2
  drops: 2-4 of 1 CopperOre : 2 Stone

rock4_heath_frac:
  children: 132
  hp: 50
  drops: 4-8 of Stone

rock2_heath_frac:
  children: 122
  hp: 50
  drops: 4-8 of Stone

beehive:
  hp: 50, weak to fire, immune to spirit & poison
  idle: 4 poison, 3 radius, every second
  on hit: 10 poison, 4 radius, every second, 5 seconds
  drops: 1 queen bee, 1-3 honey

*/
