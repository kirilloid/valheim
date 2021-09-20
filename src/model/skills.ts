export enum SkillType {
  Swords = 1,
  Knives,
  Clubs,
  Polearms,
  Spears,
  Blocking,
  Axes,
  Bows,
  Unarmed = 11,
  Pickaxes,
  WoodCutting,
  Jump = 100,
  Sneak,
  Run,
  Swim,
  Ride = 110,
}

/*
speeds: 
run: 7.3s @ 0 = 6.8 m/s (7) runSpeed
run: 5.7s@100 = 8.8 m/s (8.75)
walk: 33s     = 1.5 m/s (1.6) walkSpeed
sneak: 26s    = 1.9 m/s (2) crouchSpeed
swim: 25s     = 2.0 m/s (2) swimSpeed
jog: 12.9s    = 3.9 m/s (4) speed

jog
no cart: 12.9s= 3.9 m/s (4) speed
cart 0t: 14.4s= 3.5 m/s
cart 1t: 18.5s= 2.7 m/s
cart 2t: 21.4s= 2.3 m/s
cart 4t: 28.1s= 1.8 m/s
run
cart 0t:  9.5s= 5.3 m/s @ 0
cart 0t:  7.1s= 7.0 m/s @ 100
cart 1t: 10.1s= 5.0 m/s
cart 2t: 12.1s= 4.1 m/s
cart 4t: 13.7s= 3.6 m/s

m=409, t=25.9
m= 89, t=25.7

run: stamina drain 10 - 5 * lvl / 100
swim: stamina drain 5 - 3 * lvl / 100

melee:
hit stamina *= (1 - 0.33 * skill / 100)
chain:
damage *= 2 (lastChainDamageMultiplier is ignored)
knockback *= 1.2

ranged:
holdDurationMin: 2.5 * (1 - skill / 100)
projAcc = Math.Lerp(min, max, draw ** 0.5)
projVel = Math.Lerp(min, max, draw)
dmg *= draw

damage:
num = Mathf.Lerp(0.4f, 1f, skillFactor);
min = Mathf.Clamp01(num - 0.15f);
max = Mathf.Clamp01(num + 0.15f);

backstab:
cannot happen 5min after previous backstab

stagger:
damage *= 2

block:
weapon block params used only if there's no shield
stamina drain = 25 * blockRatio
on perfect block:
- knockback *= blockRatio / 2 and push back attacker

damage calculation:
- appply bonuses
- block
- get resistances from items and effects (the latter overrides)
- apply armor (everything but poison):
  dmg = arm < dmg / 2
    ? dmg - arm
    : dmg ** 2 / (arm * 4)
- damage durability
- add stagger damage (all physical * stagger multipler)
  when accumulated hp, make stagger

add 1.5xp


fire: over 5s every 1s
spirit: over 3s every 0.5s
posion damage ttl = 1 + sqrt(5 * dmg) ???

    this.m_ttl = 1 + Mathf.Pow(this.m_damageLeft * (IsPlayer() ? 5 : 1), 0.5);
    int hits = this.m_ttl / 1;
    this.m_damagePerHit = this.m_damageLeft / (float) hits;

*/
