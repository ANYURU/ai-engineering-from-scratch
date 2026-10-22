'use strict';

const { figure } = require('../../../_shared/figkit.js');

module.exports = figure('fig-6-1', {
  height: 340,
  title: 'Two questions pick the parallel layout',
  desc: 'First ask whether the model and the KV cache you need fit on one GPU. If yes, add copies with data parallelism. If no, ask whether the split model fits inside one machine. If yes, keep the split inside it: tensor parallelism with NVLink, or pipeline parallelism without NVLink or with an uneven split. If no, add pipeline parallelism across machines with tensor parallelism inside each.',
}, f => {
  const q1 = f.box({ x: 170, y: 20, w: 300, h: 48, hue: 'amber', title: 'Fits one GPU with its cache?' });
  const dp = f.box({ x: 20, y: 120, w: 200, h: 54, hue: 'blue', title: 'data parallelism', sub: '--data-parallel-size N' });
  const q2 = f.box({ x: 330, y: 120, w: 290, h: 48, hue: 'amber', title: 'Split model fits one machine?' });
  const tp = f.box({ x: 250, y: 226, w: 180, h: 54, hue: 'violet', title: 'tensor parallel', sub: '--tensor-parallel-size' });
  const pp = f.box({ x: 446, y: 226, w: 174, h: 54, hue: 'violet', title: 'pipeline + tensor', sub: '--pipeline-parallel-size' });
  f.path('M240 68 V96 H120 V119', { style: 'call' });
  f.text(150, 90, 'yes', { size: 11.5, hue: 'green', weight: 700, knock: true });
  f.path('M400 68 V96 H475 V119', { style: 'call' });
  f.text(438, 90, 'no', { size: 11.5, hue: 'rose', weight: 700, knock: true });
  f.path('M430 168 V198 H340 V225', { style: 'call' });
  f.text(372, 192, 'yes', { size: 11.5, hue: 'green', weight: 700, knock: true });
  f.path('M520 168 V198 H533 V225', { style: 'call' });
  f.text(548, 192, 'no', { size: 11.5, hue: 'rose', weight: 700, knock: true });
  f.text(20, 214, 'More output from a', { size: 11.5, serif: true, hue: 'ink-soft' });
  f.text(20, 230, 'model that fits.', { size: 11.5, serif: true, hue: 'ink-soft' });
  f.text(250, 304, 'No NVLink, or an uneven split:', { size: 11.5, serif: true, hue: 'ink-soft' });
  f.text(250, 320, 'use pipeline inside the machine.', { size: 11.5, serif: true, hue: 'ink-soft' });
});
