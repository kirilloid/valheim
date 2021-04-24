import { resources } from './resources';
import { items as weapons } from './weapons';
import { items as armors } from './armors';
import { Item } from '../types';

const data: Record<string, Item> = {};
resources.forEach(r => data[r.id] = r);
weapons.forEach(w => data[w.id] = w);
armors.forEach(a => data[a.id] = a);

export default data;

/*

pickable respawn rate (hours):
Raspberry 5
YellowMushroom 4
Dandelion 4
Cloudberry 5
Blueberries 5
DragonEgg 6
Mushroom 4
Thistle 4
Flint 4

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

*/