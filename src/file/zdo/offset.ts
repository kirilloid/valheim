export const offsets = {
  ownerRevision: 0, // uint
  dataRevision: 4, // uint
  persistent: 8, // bool
  owner: 9, // long
  timeCreated: 17, // long
  pgwVersion: 25, // int
  // if (version >= 16 && version < 24) += 4
  type: 29, // byte
  distant: 30, // bool
  prefab: 31, // version >= 17 ? int : void
  sector: 35, // 2x int
  position: 43, // 3x float
  rotation: 55, // 4x float
  maps: 71,
};

export function setVersion(version: number) {
  let offset = 0;

  offsets.ownerRevision = offset;
  // uint
  offset += 4;

  offsets.dataRevision = offset;
  // uint
  offset += 4;

  offsets.persistent = offset;
  // bool
  offset += 1;

  offsets.owner = offset;
  // long
  offset += 8;

  offsets.timeCreated = offset;
  // long
  offset += 8;

  offsets.pgwVersion = offset;
  // int
  offset += 4;

  if (version >= 16 && version < 24) offset += 4;

  if (version >= 23) {
    offsets.type = offset;
    // byte
    offset += 1;
  }

  if (version >= 22) {
    offsets.distant = offset;
    // bool
    offset += 1;
  }

  if (version < 13) offset += 2; // 2x char

  if (version >= 17) {
    offsets.prefab = offset;
    // int
    offset += 4;
  }

  offsets.sector = offset;
  // 2x int
  offset += 8;

  offsets.position = offset;
  // 3x float
  offset += 12;

  offsets.rotation = offset;
  // 4x float
  offset += 16;
  offsets.maps = offset;
}
