import { describe, it } from 'node:test'
import { strictEqual } from 'node:assert/strict'
import { buildRFC822Date } from '../index.js'

describe('Utils', () => {
  describe('buildRFC822Date', () => {
    it('should return a date in RFC822 format', () => {
      strictEqual(buildRFC822Date('2021-11-29T00:00:00.000Z'), 'Mon, 29 Nov 2021 01:00:00 BST')
      strictEqual(buildRFC822Date('2021-09-08T00:00:00.000+01:00'), 'Wed, 08 Sep 2021 01:00:00 BST')
    })
  })
})
