/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import getCompletionRecords from './getCompletionRecords';
import test from '@romejs/test';
import {parseJS} from '@romejs/js-parser';
import {functionDeclaration} from '@romejs/js-ast';

function helper(input: string) {
  return getCompletionRecords(functionDeclaration.assert(parseJS({
    path: 'unknown',
    input: `function foo(){${input}}`,
  }).body[0]).body);
}

test('invalid', (t) => {
  t.snapshot(helper(`{}`));
  t.snapshot(helper(`'foobar';`));
  t.snapshot(helper(`if (bar) {'foobar';}`));
  t.snapshot(helper(`if (bar) {'foobar';} else {}`));
  t.snapshot(helper(`switch (foo) {}`));
  t.snapshot(helper(`switch (foo) {case 'bar': {}}`));
  t.snapshot(helper(`switch (foo) {default: {}}`));
});

test('completions', (t) => {
  t.snapshot(helper(`return false;`));
  t.snapshot(helper(`return; invalid;`));
  t.snapshot(helper(`if (bar) {return false;}`));
  t.snapshot(helper(`if (bar) {return false;} else {return true;}`));
  t.snapshot(helper(`switch (foo) {default: {return false;}}`));
  t.snapshot(helper(`switch (foo) {default: {return false;}}`));
});

test('mix', (t) => {
  t.snapshot(helper(`switch (foo) {default: {if (true) {return false;}}}`));
});
