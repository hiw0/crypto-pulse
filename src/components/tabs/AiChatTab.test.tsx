import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidElement } from 'react';
import { renderInlineMarkdown } from './AiChatTab';

test('renderInlineMarkdown renders bold text as React elements', () => {
  const nodes = renderInlineMarkdown('This is **important**.');
  const strong = nodes.find(isValidElement);

  assert.ok(strong);
  assert.equal(strong.type, 'strong');
  assert.equal(strong.props.children, 'important');
});

test('renderInlineMarkdown allows http links and rejects javascript links', () => {
  const nodes = renderInlineMarkdown('[ok](https://example.com) [bad](javascript:alert(1))');
  const links = nodes.filter(isValidElement).filter(node => node.type === 'a');

  assert.equal(links.length, 1);
  assert.equal(links[0].props.href, 'https://example.com/');
  assert.ok(nodes.includes('bad'));
});
