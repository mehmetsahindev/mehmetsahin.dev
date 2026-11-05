import { describe, expect, it } from "vitest"

import { formatMonth, formatPeriod, MONTH_PATTERN } from "./dates"

describe("formatMonth", () => {
  it("turns YYYY-MM into MM.YYYY", () => {
    expect(formatMonth("2024-03")).toBe("03.2024")
  })
})

describe("formatPeriod", () => {
  it("leaves the end undefined for current roles", () => {
    expect(formatPeriod("2025-06", null)).toEqual({
      start: "06.2025",
      end: undefined,
    })
  })

  it("formats both ends", () => {
    expect(formatPeriod("2020-01", "2021-12")).toEqual({
      start: "01.2020",
      end: "12.2021",
    })
  })
})

describe("MONTH_PATTERN", () => {
  it("accepts valid months only", () => {
    expect(MONTH_PATTERN.test("2024-12")).toBe(true)
    expect(MONTH_PATTERN.test("2024-13")).toBe(false)
    expect(MONTH_PATTERN.test("2024-1")).toBe(false)
  })
})
