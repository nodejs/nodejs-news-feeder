import { describe, it } from 'node:test'
import { strictEqual, match } from 'node:assert/strict'
import { buildRFC822Date, getCurrentRetroDate, getNextRetroDate } from '../index.js'

describe('Utils', () => {
  describe('buildRFC822Date', () => {
    it('should return a date in RFC822 format', () => {
      strictEqual(buildRFC822Date('2021-11-29T00:00:00.000Z'), 'Mon, 29 Nov 2021 01:00:00 BST')
      strictEqual(buildRFC822Date('2021-09-08T00:00:00.000+01:00'), 'Wed, 08 Sep 2021 01:00:00 BST')
    })
  })

  describe('getCurrentRetroDate', () => {
    it('should return a date in YYYY-MM-DD format', () => {
      const result = getCurrentRetroDate()
      match(result, /^\d{4}-\d{2}-\d{2}$/)
    })

    it('should return a Sunday date', () => {
      const result = getCurrentRetroDate()
      const date = new Date(result + 'T00:00:00Z')
      strictEqual(date.getUTCDay(), 0) // 0 = Sunday
    })

    it('should return a date in the past', () => {
      const result = getCurrentRetroDate()
      const resultDate = new Date(result + 'T00:00:00Z')
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      strictEqual(resultDate < today, true)
    })

    it('should return previous Sunday when called on a Sunday', () => {
      // Mock Date to be Sunday Feb 15, 2026
      const originalDate = globalThis.Date
      const mockDate = class extends Date {
        constructor (...args) {
          if (args.length === 0) {
            super('2026-02-15T12:00:00Z')
          } else {
            super(...args)
          }
        }
      }
      globalThis.Date = mockDate

      const result = getCurrentRetroDate()
      strictEqual(result, '2026-02-08')

      globalThis.Date = originalDate
    })

    it('should return most recent Sunday when called on a weekday', () => {
      // Mock Date to be Wednesday Feb 18, 2026
      const originalDate = globalThis.Date
      const mockDate = class extends Date {
        constructor (...args) {
          if (args.length === 0) {
            super('2026-02-18T12:00:00Z')
          } else {
            super(...args)
          }
        }
      }
      globalThis.Date = mockDate

      const result = getCurrentRetroDate()
      strictEqual(result, '2026-02-15')

      globalThis.Date = originalDate
    })

    it('should return most recent Sunday when called on a Saturday', () => {
      // Mock Date to be Saturday Feb 21, 2026
      const originalDate = globalThis.Date
      const mockDate = class extends Date {
        constructor (...args) {
          if (args.length === 0) {
            super('2026-02-21T12:00:00Z')
          } else {
            super(...args)
          }
        }
      }
      globalThis.Date = mockDate

      const result = getCurrentRetroDate()
      strictEqual(result, '2026-02-15')

      globalThis.Date = originalDate
    })

    it('should handle year boundary correctly', () => {
      // Mock Date to be Sunday Jan 4, 2026
      const originalDate = globalThis.Date
      const mockDate = class extends Date {
        constructor (...args) {
          if (args.length === 0) {
            super('2026-01-04T12:00:00Z')
          } else {
            super(...args)
          }
        }
      }
      globalThis.Date = mockDate

      const result = getCurrentRetroDate()
      strictEqual(result, '2025-12-28')

      globalThis.Date = originalDate
    })
  })

  describe('getNextRetroDate', () => {
    it('should return the date 7 days after the input', () => {
      strictEqual(getNextRetroDate('2026-02-08'), '2026-02-15')
      strictEqual(getNextRetroDate('2025-12-28'), '2026-01-04')
      strictEqual(getNextRetroDate('2026-02-22'), '2026-03-01')
    })

    it('should return a date in YYYY-MM-DD format', () => {
      const result = getNextRetroDate('2026-02-08')
      match(result, /^\d{4}-\d{2}-\d{2}$/)
    })

    it('should handle year boundary correctly', () => {
      strictEqual(getNextRetroDate('2025-12-28'), '2026-01-04')
      strictEqual(getNextRetroDate('2025-12-21'), '2025-12-28')
    })

    it('should handle month boundaries correctly', () => {
      strictEqual(getNextRetroDate('2026-01-25'), '2026-02-01')
      strictEqual(getNextRetroDate('2026-03-29'), '2026-04-05')
      strictEqual(getNextRetroDate('2026-07-26'), '2026-08-02')
    })

    it('should handle leap year correctly', () => {
      // 2024 is a leap year
      strictEqual(getNextRetroDate('2024-02-25'), '2024-03-03')
      // 2025 is not a leap year
      strictEqual(getNextRetroDate('2025-02-23'), '2025-03-02')
    })
  })
})
