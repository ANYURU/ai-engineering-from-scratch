'use strict';

const path = require('path');
const { figure } = require('../../../_shared/figkit.js');
const { chart, legend, load } = require('../../../_shared/chart.js');

const runs = load(path.join(__dirname, '../../capture/gpu/summary/miles-gb10-lab.json')).runs;
const small = runs['e4-0.6b'].median;
const large = runs['e4-1.7b'].median;
const items = [];
for (const [key, name] of [['update_weights_time_s', 'update'], ['sleep_time_s', 'release'], ['wake_up_time_s', 'resume']]) {
  items.push({ name: `${name} 0.6B`, value: small[key], hue: 'blue', label: `${small[key].toFixed(2)} s` });
  items.push({ name: `${name} 1.7B`, value: large[key], hue: 'violet', label: `${large[key].toFixed(2)} s` });
}

module.exports = figure('fig-2-4', {
  height: 330,
  title: 'A larger model costs more to release than to update',
  desc: `Median seconds over 4 short steps. Weight update: ${small.update_weights_time_s.toFixed(2)} s for Qwen3-0.6B and ${large.update_weights_time_s.toFixed(2)} s for Qwen3-1.7B. Release: ${small.sleep_time_s.toFixed(2)} and ${large.sleep_time_s.toFixed(2)} s. Resume: ${small.wake_up_time_s.toFixed(2)} and ${large.wake_up_time_s.toFixed(2)} s.`,
}, f => {
  const c = chart(f, { x: 60, y: 56, w: 560, h: 200, xDomain: [0, 1], yDomain: [0, 5], yTicks: [0, 2.5, 5], yLabel: 'seconds, median of 4 steps' });
  c.bars(items, { width: 52 });
  legend(f, [{ name: 'Qwen3-0.6B', hue: 'blue' }, { name: 'Qwen3-1.7B, 2.8 times the size', hue: 'violet' }], 60, 22);
  f.text(60, 314, 'The update grew 1.4 times. Release and resume grew 2.4 and 1.8 times.', { size: 12, serif: true });
});
