const drop = {
  chance: 0.5,
  num: [2, 3],
  options: [
    { item: 'Resin', num: [2, 4], weight: 2 },
    { item: 'Acorn', num: [2, 3], weight: 2 },
    { item: 'Feathers', num: [2, 3], weight: 1 },
  ]
};

function randRange(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function zeroes(max) {
  return Array.from({ length: max + 1 }, () => 0); 
}

function monteCarloDrop(drop, iterations) {
  const step = 1 / iterations;
  const stats = Object.fromEntries(
    drop.options.map(op => [
      op.item,
      zeroes(op.num[1] * drop.num[1])
    ])
  );
  
  for (let i = 0; i < iterations; i++) {
    const nums = Object.fromEntries(drop.options.map(op => [op.item, 0]));
    if (Math.random() < drop.chance) {
      const num = randRange(...drop.num);
      const totalWeight = drop.options.reduce((w, op) => w + op.weight, 0);
      for (let i = 0; i < num; i++) {
        const randWeight = Math.random() * totalWeight;
        let accumWeight = 0;
        for (const op of drop.options) {
          accumWeight += op.weight;
          if (accumWeight >= randWeight) {
            nums[op.item] += randRange(...op.num);
            break;
          }
        }
      }
    }
    for (const item in nums) {
      stats[item][nums[item]] += step;
    }
  }
  return stats;
}
