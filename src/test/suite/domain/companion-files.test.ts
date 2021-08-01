import * as assert from 'assert';
import { CompanionFiles } from "../../../domain/companion-files";

suite('CompanionFiles', () => {
  test('when companion files paths contains the current should filter out current from result', () => {
    const result = new CompanionFiles({} as any).matchCompanion('some.component.ts', ['some.component.ts', 'some.component.html']);
    assert.strictEqual(['some.component.html'], result);
  });
});