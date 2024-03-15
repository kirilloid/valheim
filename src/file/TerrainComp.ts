import { inflate, deflate } from 'pako';

import type { Vector3 } from '../model/utils';
import { PackageReader, PackageWriter } from './Package';
import { checkVersion, TERRAIN_COMP } from './versions';

export type Data = {
  version: number;
  operations: number;
  lastOpPoint: Vector3;
  lastOpRadius: number;
  modifiedHeight: Int8Array;
  levelDelta: Float32Array;
  smoothDelta: Float32Array;
  modifiedPaint: Int8Array;
  paintMask: ImageData;
};

export function read(bytes: Uint8Array): Data {
  const data = inflate(bytes);
  const zpackage = new PackageReader(data);
  const version = zpackage.readInt();
  checkVersion('terrain comp', version, TERRAIN_COMP);
  const operations = zpackage.readInt();
  const lastOpPoint = zpackage.readVector3();
  const lastOpRadius = zpackage.readFloat();
  const heightSize = zpackage.readInt();
  const modifiedHeight = new Int8Array(heightSize);
  const levelDelta = new Float32Array(heightSize);
  const smoothDelta = new Float32Array(heightSize);
  for (let index = 0; index < heightSize; ++index) {
    const modified = zpackage.readBool();
    modifiedHeight[index] = modified ? 1 : 0;
    levelDelta[index] = modified ? zpackage.readFloat() : 0;
    smoothDelta[index] = modified ? zpackage.readFloat() : 0;
  }
  const paintSize = zpackage.readInt();
  const modifiedPaint = new Int8Array(paintSize);
  const side = Math.round(Math.sqrt(paintSize));
  const paintMask = new ImageData(side, side);
  for (let index = 0; index < paintSize; ++index) {
    const modified = zpackage.readBool();
    modifiedPaint[index] = modified ? 1 : 0;
    if (modified) {
      paintMask.data[index * 4 + 0] = Math.round(zpackage.readFloat() * 255);
      paintMask.data[index * 4 + 1] = Math.round(zpackage.readFloat() * 255);
      paintMask.data[index * 4 + 2] = Math.round(zpackage.readFloat() * 255);
      paintMask.data[index * 4 + 3] = Math.round(zpackage.readFloat() * 255);
    } // by default it's #0000
  }
  return {
    version,
    operations,
    lastOpPoint,
    lastOpRadius,
    modifiedHeight,
    levelDelta,
    smoothDelta,
    modifiedPaint,
    paintMask,
  };
}

export function write(tcData: Data): Uint8Array {
  const zpackage = new PackageWriter();
  zpackage.writeInt(tcData.version);
  zpackage.writeInt(tcData.operations);
  zpackage.writeVector3(tcData.lastOpPoint);
  zpackage.writeFloat(tcData.lastOpRadius);
  zpackage.writeInt(tcData.modifiedHeight.length);
  for (let index = 0; index < tcData.modifiedHeight.length; ++index) {
    zpackage.writeBool(tcData.modifiedHeight[index] === 1);
    if (tcData.modifiedHeight[index]) {
      zpackage.writeFloat(tcData.levelDelta[index]!);
      zpackage.writeFloat(tcData.smoothDelta[index]!);
    }
  }
  zpackage.writeInt(tcData.modifiedPaint.length);
  for (let index = 0; index < tcData.modifiedPaint.length; ++index) {
    const modified = tcData.modifiedPaint[index] !== 0;
    zpackage.writeBool(modified);
    if (modified) {
      zpackage.writeFloat(tcData.paintMask.data[index * 4 + 0]! / 255);
      zpackage.writeFloat(tcData.paintMask.data[index * 4 + 1]! / 255);
      zpackage.writeFloat(tcData.paintMask.data[index * 4 + 2]! / 255);
      zpackage.writeFloat(tcData.paintMask.data[index * 4 + 3]! / 255);
    }
  }
  return deflate(zpackage.flush(), { level: 1 });
}
