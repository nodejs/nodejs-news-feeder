import { buildRFC822Date } from '../utils'

describe('Utils', () => {
  describe('buildRFC822Date', () => {
    it('should return a date in RFC822 format', () => {
      expect(buildRFC822Date('2021-11-29T00:00:00.000Z')).toBe('Mon, 29 Nov 2021 01:00:00 BST')
      expect(buildRFC822Date('2021-09-08T00:00:00.000+01:00')).toBe('Wed, 08 Sep 2021 01:00:00 BST')
    })
  })
})
