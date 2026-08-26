import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

const qrVendorCode = fs.readFileSync(path.resolve(__dirname, '../vendor/qrcode.min.js'), 'utf8');
window.eval(qrVendorCode);

import '../sync-engine.js';

describe('QR Code Generation & P2P Codec (Production Code)', () => {
  it('generates a valid, parseable SVG Data URI using local QRCode vendor library', () => {
    const testUrl = 'https://cableblues.github.io/Flow-Organiser/#sync=FLOW-AB12&data=testData';
    const svgDataUri = MinimalQR.generateQRCodeSVG(testUrl, 260);

    expect(svgDataUri).toBeDefined();
    expect(svgDataUri.startsWith('data:image/svg+xml;charset=utf-8,')).toBe(true);
    const decodedSvg = decodeURIComponent(svgDataUri.replace('data:image/svg+xml;charset=utf-8,', ''));
    expect(decodedSvg).toContain('<svg');
    expect(decodedSvg).toContain('</svg>');
    expect(decodedSvg).toContain('viewBox');
  });

  it('P2PDataCodec encodes and decodes state losslessly', () => {
    const testState = {
      activeWorkspace: 'work',
      items: {
        daily: ['Task 1', 'Task 2'],
        weekly: ['Task 3']
      },
      done: [{ task: 'Done 1', time: '10:00', origin: 'daily' }],
      workItems: {
        work_focus: ['Job 1'],
        work_in_progress: ['Job 2']
      },
      workDone: [{ task: 'Work Done 1', time: '11:00', origin: 'work_focus' }]
    };

    const encoded = P2PDataCodec.encodeState(testState);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(10);
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');

    const decoded = P2PDataCodec.decodeState(encoded);
    expect(decoded).toBeDefined();
    expect(decoded.ws).toBe('work');
    expect(decoded.items.daily).toEqual(['Task 1', 'Task 2']);
    expect(decoded.workItems.work_focus).toEqual(['Job 1']);
    expect(decoded.done[0].task).toBe('Done 1');
  });
});
