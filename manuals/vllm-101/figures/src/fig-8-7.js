'use strict';

const { figure } = require('../../../_shared/figkit.js');

const tokens = [
  { t: 'Paris', state: 'kept', hue: 'green' },
  { t: 'is', state: 'kept', hue: 'green' },
  { t: 'big', state: 'rejected', hue: 'rose' },
];

module.exports = figure('fig-8-7', {
  height: 252,
  title: 'One verify pass keeps the guesses up to the first rejection, plus one token',
  desc: 'A proposer guesses three tokens. The target model runs once over them. The first two match the target and stay. The third is rejected, so the target samples its own token there and the step ends. The step wrote three tokens in one target pass instead of one.',
}, f => {
  f.kicker(20, 18, 'proposer guesses, 3 tokens');
  tokens.forEach((tk, i) => f.box({ x: 20 + i * 130, y: 28, w: 116, h: 40, hue: 'violet', title: tk.t }));
  tokens.forEach((tk, i) => {
    f.box({ x: 20 + i * 130, y: 114, w: 116, h: 40, hue: tk.hue, dash: tk.state === 'rejected' ? 'dashed' : undefined, title: tk.state });
    f.arrow([78 + i * 130, 68], [78 + i * 130, 113], { style: 'model' });
  });
  f.box({ x: 410, y: 114, w: 120, h: 40, hue: 'plum', title: 'the', sub: 'target token' });
  f.arrow([396, 134], [409, 134], { style: 'model' });
  f.text(20, 186, 'The target model checks all three guesses in one pass.', { size: 11.5, serif: true, hue: 'ink-soft' });
  f.text(20, 208, 'Output of this step: Paris is the, three tokens from one pass of the target.', { size: 11.5, serif: true, hue: 'ink-soft' });
  f.text(20, 230, 'A step always writes at least one token and at most the guesses plus one.', { size: 11.5, serif: true, hue: 'ink-soft' });
});
