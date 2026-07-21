import { describe, expect, it } from "vitest";

import { getSetInitials } from "./get-initials";

describe("getSetInitials", () => {
  it("covers the general matrix (up to 3 initials)", () => {
    expect(getSetInitials("X")).toBe("X");
    expect(getSetInitials("Prince")).toBe("P");
    expect(getSetInitials("Lovely Paul")).toBe("LP");
    expect(getSetInitials("Felix Mathieu Wien")).toBe("FMW");
    expect(getSetInitials("Alexandria Ocasio-Cortez")).toBe("AOC");
    expect(getSetInitials("IKEA Customer Service")).toBe("ICS");
    expect(getSetInitials("Priya Shankar-Lee-Brown")).toBe("PS");
    expect(getSetInitials("Mary Jane Ng")).toBe("MJN");
    expect(getSetInitials("Ai-my Watts Chang")).toBe("AWC");
    expect(getSetInitials("Lysette Leighton-Amaro Quartz")).toBe("LLQ");
    expect(getSetInitials("Jack Shu Wellington-Chan")).toBe("JSW");
    expect(getSetInitials("Phan Văn Trường")).toBe("PVT");
  });

  it("handles lowercase surname particles", () => {
    expect(getSetInitials("lowercase mcdonald")).toBe("Lm");
    expect(getSetInitials("Cassidy da Silva")).toBe("Cd");
    expect(getSetInitials("Hunter van Dijk Haas")).toBe("Hv");
    expect(getSetInitials("Jenny d’Orsay")).toBe("Jd");
    expect(getSetInitials("Jessica de’Anth-Hansel")).toBe("Jd");
    expect(getSetInitials("Antonio Clark-d’Jonge")).toBe("ACd");
  });

  it("handles hyphenated first names", () => {
    expect(getSetInitials("Bethany-Anne Irving")).toBe("BI");
    expect(getSetInitials("BethanyAnne Irving")).toBe("BI");
    expect(getSetInitials("Bethany-Anne Hannah Irving")).toBe("BHI");
  });

  it("uses first + last for four or more words where no lowercase particle exists", () => {
    expect(getSetInitials("Brent Christian Nathaniel Marks")).toBe("BM");
    expect(getSetInitials("Random Potato SYD Corp")).toBe("RC");
    expect(getSetInitials("Miss Jones Customer Care")).toBe("MC");
    expect(getSetInitials("Bobby Johnny Five-Names Jimmy Smith")).toBe("BS");
    expect(getSetInitials("Philip Long Name Reginald van Smith")).toBe("Pv");
    expect(getSetInitials("Sara von Long Name Baker Watson")).toBe("Sv");
    expect(getSetInitials("George R R Martin")).toBe("GM");
  });

  it("disregards unsupported leading characters and unsupported scripts", () => {
    expect(getSetInitials("Magic Ball 8")).toBeUndefined();
    expect(getSetInitials("Formula1 Racing")).toBe("FR");
    expect(getSetInitials("日本語")).toBeUndefined();
    expect(getSetInitials("🥛 milk it")).toBeUndefined();
    expect(getSetInitials("doughnut boi 🍩")).toBe("Db");
  });
});
