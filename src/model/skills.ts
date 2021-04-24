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
}

/*

bows 1.5
spears 1.5
blocking 0.5
jump 0.5
sneak 0.5
run 0.2
swim 0.3

run: stamina drain 8 * (1 - lvl / 200)
     speed: 2 * (1 + 0.25 * lvl / 100) 
swim: stamina drain 6 * (1 - lvl / 200)

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



posion damage ttl = 2 + sqrt(2 * dmg) ???

*/
