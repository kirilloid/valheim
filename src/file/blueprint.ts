import type { Quaternion, Vector3 } from '../model/utils';

export type Blueprint = {
  id: string;
  prefabName: string;
  name?: string;
  pieceEntries: PieceEntry[];
  snapPoints: Vector3[];
  creator?: string;
  description?: string;
  category?: string;
};

type PieceEntry = {
  name: string;
  category: string;
  pos: Vector3;
  quat: Quaternion;
  additionalInfo: string;
}

type Format = 'VBuild' | 'Blueprint';
type ParserState = 'SnapPoints' | 'Pieces';

function readPieceEntry(line: string, format: Format): PieceEntry {
  line = line.replace(/,/g, '.');
  let x, y, z, w;
  if (format === 'Blueprint') {
    const parts = line.split(';');
    const name = parts[0]!;
    const category = parts[1]!;
    [x, y, z] = parts.slice(2, 5).map(Number);
    const pos = { x, y, z } as Vector3;
    [x, y, z, w] = parts.slice(5, 9).map(Number);
    const quat = { x, y, z, w } as Quaternion;
    const additionalInfo = parts[9]!;
    return {name, category, pos, quat, additionalInfo };
  } else {
    const parts = line.split(' ');
    const category = 'Building';
    const name = parts[0]!;
    [x, y, z, w] = parts.slice(1, 5).map(Number);
    const quat = { x, y, z, w } as Quaternion;
    [x, y, z] = parts.slice(5, 8).map(Number);
    const pos = { x, y, z } as Vector3;
    const additionalInfo = '';
    return { name, category, pos, quat, additionalInfo };
  }
}

export function fromLines(id: string, lines: string[], format: Format): Blueprint {
  const prefabName = "piece_blueprint:" + id;
  const pieceEntries: PieceEntry[] = [];
  const snapPoints: Vector3[] = [];
  let parserState: ParserState = 'Pieces';
  const blueprint: Blueprint = { id, prefabName, pieceEntries, snapPoints };
  for (const line of lines) {
    if (line) {
      const m = line.match(/^#(Name|Creator|Description):(.*)/);
      if (m != null) {
        switch (m[1]) {
          case 'Name':
            blueprint.name = m[2];
            break;
          case 'Creator':
            blueprint.creator = m[2];
            break;
          case 'Description':
            blueprint.description = JSON.parse(m[2] ?? '');
            break;
          case 'Category':
            blueprint.category = m[2];
            break;
        }
        blueprint.name = line.slice(6);
      } else if (line == "#SnapPoints") {
        parserState = 'SnapPoints';
      } else if (line == "#Pieces") {
        parserState = 'Pieces';
      } else if (!line.startsWith("#")) {
        switch (parserState) {
          case 'SnapPoints': {
            const [x, y, z] = line.split(';').map(Number);
            snapPoints.push({ x, y, z } as Vector3);
            continue;
          }
          case 'Pieces':
            pieceEntries.push(readPieceEntry(line, format));
            continue;
          default:
            continue;
        }
      }
    }
  }
  blueprint.name ??= blueprint.id;
  return blueprint;
}