import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const source = (await readFile(new URL('./messageSlice.js', import.meta.url), 'utf8'))
  .replace('import.meta.env.VITE_API_URL', '"https://example.invalid"')
  .replace('"@reduxjs/toolkit"', JSON.stringify(import.meta.resolve('@reduxjs/toolkit')))
  .replace('"axios"', JSON.stringify(import.meta.resolve('axios')));
const { default: reducer, getMessages, sendMessage, clearMessages } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('late responses cannot replace the selected channel', () => {
  let state = reducer(undefined, getMessages.pending('old', 1));
  state = reducer(state, getMessages.pending('new', 2));
  state = reducer(state, getMessages.fulfilled([{ id: 2 }], 'new', 2));
  state = reducer(state, getMessages.fulfilled([{ id: 1 }], 'old', 1));
  assert.deepEqual(state.messages, [{ id: 2 }]);
});

test('sending keeps messages visible and ignores sends to another channel', () => {
  let state = reducer(undefined, getMessages.pending('load', 2));
  state = reducer(state, getMessages.fulfilled([{ id: 2 }], 'load', 2));
  state = reducer(state, sendMessage.pending('send', { channel: 1 }));
  assert.equal(state.isLoading, false);
  assert.equal(state.isSending, true);
  state = reducer(state, sendMessage.fulfilled({ id: 1 }, 'send', { channel: 1 }));
  assert.deepEqual(state.messages, [{ id: 2 }]);
  assert.equal(state.isSending, false);
});

test('clearing messages invalidates pending requests', () => {
  let state = reducer(undefined, getMessages.pending('load', 2));
  state = reducer(state, clearMessages());
  state = reducer(state, getMessages.fulfilled([{ id: 9 }], 'load', 2));
  assert.deepEqual(state.messages, []);
});
