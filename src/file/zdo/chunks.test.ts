import { ZDO } from '../../view/world/types';
import { PackageWriter } from '../Package';
import { readChunkData, writeChunkData } from './chunks';

describe('chunk file helpers', () => {
  test('reads and writes empty chunk payloads', () => {
    const writer = new PackageWriter();
    const version = 40;
    writer.writeShort(version);
    writer.writeInt(0);
    const bytes = writer.flush();

    const data = readChunkData(bytes);
    expect(data.info.numZDOs).toBe(0);

    const roundTrip = writeChunkData({
      name: '',
      zdos: [],
      info: { numZDOs: 0, chunkIndex: 0, version },
    });
    expect(roundTrip.length).toBeGreaterThan(0);
  });
});
