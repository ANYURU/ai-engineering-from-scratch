'use strict';

const path = require('path');
const { figure } = require('../../../_shared/figkit.js');
const { chart, load } = require('../../../_shared/chart.js');

const m = load(path.join(__dirname, '../../capture/gpu/summary/miles-gb10-lab.json')).runs['plain-48'].median_unpaused;
const parts = [
  { key: 'rollout_time_s', name: 'rollout', hue: 'violet' },
  { key: 'log_probs_time_s', name: 'log-probs', hue: 'blue' },
  { key: 'train_time_s', name: 'train', hue: 'blue' },
  { key: 'sleep_time_s', name: 'offload', hue: 'amber' },
  { key: 'wake_up_time_s', name: 'onload', hue: 'amber' },
  { key: 'update_weights_time_s', name: 'update', hue: 'amber' },
];

module.exports = figure('fig-1-1b', {
  height: 330,
  title: 'Where the time of one step goes',
  desc: `Median seconds per phase over 48 steps with no heat pause, Qwen3-0.6B on one GB10: rollout ${m.rollout_time_s.median.toFixed(1)}, log probabilities ${m.log_probs_time_s.median.toFixed(1)}, train ${m.train_time_s.median.toFixed(1)}, trainer offload ${m.sleep_time_s.median.toFixed(2)}, trainer onload ${m.wake_up_time_s.median.toFixed(2)}, and weight update ${m.update_weights_time_s.median.toFixed(2)}.`,
}, f => {
  const c = chart(f, { x: 60, y: 40, w: 560, h: 220, xDomain: [0, 1], yDomain: [0, 110], yTicks: [0, 25, 50, 75, 100], yLabel: 'seconds per step, median' });
  c.bars(parts.map(p => ({ name: p.name, value: m[p.key].median, hue: p.hue, label: m[p.key].median >= 10 ? `${m[p.key].median.toFixed(1)} s` : `${m[p.key].median.toFixed(2)} s` })));
  f.text(60, 312, 'Tune training and rollout first. The three amber phases add up to about 2 s.', { size: 12, serif: true });
});
