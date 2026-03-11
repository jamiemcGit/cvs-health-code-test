import { formatUsd } from "../utils/formatUsd"

describe("formatUsd", () => {
  it("returns null when value is null", () => {
    expect(formatUsd(null)).toBeNull()
  })

  it("formats whole dollar amounts with currency and no decimals", () => {
    expect(formatUsd(0)).toBe("$0")
    expect(formatUsd(1000)).toBe("$1,000")
    expect(formatUsd(1234567)).toBe("$1,234,567")
  })

  it("rounds values to the nearest whole dollar", () => {
    expect(formatUsd(99.4)).toBe("$99")
    expect(formatUsd(99.5)).toBe("$100")
  })
})

