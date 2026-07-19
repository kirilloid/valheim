import { ZDO, ZDOObjectType, ZDOValues } from '../types';

import { readZdo } from './mmap30';
import { writeZdo_post30 } from './full';
import { nop, Quaternion, Vector3 } from '../../model/utils';
import { zoneId } from '../../model/zdo-selectors';
import { PackageReader, PackageWriter } from '../Package';

function getDefaultZDO(version: number): ZDO {
  return {
    version,
    _bytes: new Uint8Array(),
    persistent: false,
    type: ZDOObjectType.Default,
    distant: false,
    prefab: -1,
    sector: zoneId({ x: 0, y: 0 }),
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    floats: new Map<number, number>(),
    vec3: new Map<number, Vector3>(),
    quats: new Map<number, Quaternion>(),
    ints: new Map<number, number>(),
    longs: new Map<number, bigint>(),
    strings: new Map<number, string>(),
    byteArrays: new Map<number, Uint8Array>(),
    _offset: 0,
    save: writeZdo_post30,
  }
}

const extractFields = ({
  version, persistent, type, distant, prefab, sector, position, rotation,
  floats, vec3, quats, ints, longs, strings, byteArrays,
}: ZDO): ZDOValues => ({
  version, persistent, type, distant, prefab, sector, position, rotation,
  floats: new Map([...floats.entries()]),
  vec3: new Map([...vec3.entries()]),
  quats: new Map([...quats.entries()]),
  ints: new Map([...ints.entries()]),
  longs: new Map([...longs.entries()]),
  strings: new Map([...strings.entries()]),
  byteArrays: new Map([...byteArrays.entries()]),
});

function load(bytes: Uint8Array, version: number): ZDO {
  const reader = new PackageReader(bytes);
  return readZdo(reader, version);  
}

function save(zdo: ZDO): Uint8Array {
  const writer = new PackageWriter(1024);
  zdo.save(writer);
  return writer.flush();
}

function testReadMmap(
  name: string,
  version: number,
  overrides: Partial<ZDOValues>,
) {
  test(name, () => {
    const zdoF = { ...getDefaultZDO(version), ...overrides };
    const zdoM = load(save(zdoF), version);
    expect(extractFields(zdoM)).toEqual(extractFields(zdoF));
  });
}

function testWriteMmap(
  name: string,
  version: number,
  overrides: Partial<ZDOValues>,
  mutations: (zdo: ZDO) => void,
) {
  test(name, () => {
    const zdoF = { ...getDefaultZDO(version), ...overrides };
    const zdoM = load(save(zdoF), version);
    mutations(zdoF);
    mutations(zdoM);
    expect(save(zdoM)).toEqual(save(zdoF));
  });
}

const connectionData = { type: 1, hash: 123456 };

// testing by comparing to simpler implementation
describe('mmap', () => {
  describe('read - 30', () => {
    testReadMmap('basic', 30, {});
    testReadMmap('rotation', 30, { rotation: { x: 0, y: 1, z: 0 } });
    testReadMmap('position', 30, { rotation: { x: 0, y: 1, z: 0 } });
    testReadMmap('connectionData', 30, { connectionData });
    testReadMmap('ints', 30, { ints: new Map([[0, 0]]) });
    testReadMmap('strings', 30, { strings: new Map([[0, 'foo']]) });
  });
  describe('read - 40', () => {
    testReadMmap('rotation', 40, { rotation: { x: 0, y: 1, z: 0 } });
    testReadMmap('position', 40, { rotation: { x: 0, y: 1, z: 0 } });
  });
  describe('basic write - 30', () => {
    testWriteMmap('basic', 30, {}, nop);
    testWriteMmap('persistent', 30, {}, zdo => zdo.persistent = true);
    testWriteMmap('distant', 30, {}, zdo => zdo.distant = true);
    testWriteMmap('type', 30, {}, zdo => zdo.type = ZDOObjectType.Prioritized);
    testWriteMmap('prefab', 30, {}, zdo => zdo.prefab = 1);
    testWriteMmap('connectionData', 30, { connectionData }, nop);
    testWriteMmap('position', 30, {}, zdo => zdo.position = { x: 0, y: 1, z: 0 });
    testWriteMmap('rotation', 30, {}, zdo => zdo.rotation = { x: 0, y: 1, z: 0 });
  });
  describe('basic write - 40', () => {
    testWriteMmap('position', 40, {}, zdo => zdo.position = { x: 0, y: 1, z: 0 });
    testWriteMmap('rotation', 40, {}, zdo => zdo.rotation = { x: 0, y: 1, z: 0 });
  });

  describe('fixed map mutations', () => {
    describe('ints empty', () => {
      testWriteMmap('touched', 30, {}, zdo => expect(zdo.ints.size).toEqual(0));
      testWriteMmap('added', 30, {}, zdo => zdo.ints.set(0, 0));
      testWriteMmap('disturbed', 30, {}, zdo => {
        zdo.ints.set(0, 0);
        zdo.ints.delete(0);
      });
    });

    describe('ints prefilled', () => {
      testWriteMmap('touched', 30, { ints: new Map([[0, 0]]) }, zdo => expect(zdo.ints.size).toEqual(1));
      testWriteMmap('changed', 30, { ints: new Map([[0, 0]]) }, zdo => zdo.ints.set(0, 1));
      testWriteMmap('emptied', 30, { ints: new Map([[0, 0]]) }, zdo => zdo.ints.delete(0));
      testWriteMmap('added', 30, { ints: new Map([[0, 0]]) }, zdo => zdo.ints.set(1, 1));
    });
  });

  describe('dynamic map mutations', () => {
    describe('strings empty', () => {
      testWriteMmap('touched', 30, {}, zdo => expect(zdo.strings.size).toEqual(0));
      testWriteMmap('added', 30, {}, zdo => zdo.strings.set(0, 'foo'));
      testWriteMmap('disturbed', 30, {}, zdo => {
        zdo.strings.set(0, 'foo');
        zdo.strings.delete(0);
      });
    });

    describe('strings prefilled', () => {
      testWriteMmap('touched', 30, { strings: new Map([[0, 'foo']]) }, zdo => expect(zdo.strings.size).toEqual(1));
      testWriteMmap('changed: decreased', 30, { strings: new Map([[0, 'foo']]) }, zdo => zdo.strings.set(0, 'fu'));
      testWriteMmap('changed: icnreased', 30, { strings: new Map([[0, 'foo']]) }, zdo => zdo.strings.set(0, 'barbaz'));
      testWriteMmap('emptied', 30, { strings: new Map([[0, 'foo']]) }, zdo => zdo.strings.delete(0));
      testWriteMmap('added', 30, { strings: new Map([[0, 'foo']]) }, zdo => zdo.strings.set(1, 'bar'));
    });
  });
});

