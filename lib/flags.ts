// Maps the 3-letter team codes used in the DB to flagcdn.com alpha-2 slugs.
// Most are ISO 3166-1 alpha-2 in lowercase; England and Scotland use the
// gb-eng / gb-sct sub-region slugs that flagcdn.com supports.
const FLAG_CODES: Record<string, string> = {
  ARG: "ar",
  AUS: "au",
  AUT: "at",
  BEL: "be",
  BIH: "ba",
  BRA: "br",
  CAN: "ca",
  CHE: "ch",
  CIV: "ci",
  COD: "cd",
  COL: "co",
  CPV: "cv",
  CUW: "cw",
  CZE: "cz",
  DEU: "de",
  DZA: "dz",
  ECU: "ec",
  EGY: "eg",
  ENG: "gb-eng",
  ESP: "es",
  FRA: "fr",
  GHA: "gh",
  HTI: "ht",
  HRV: "hr",
  IRN: "ir",
  IRQ: "iq",
  JOR: "jo",
  JPN: "jp",
  KOR: "kr",
  MAR: "ma",
  MEX: "mx",
  NLD: "nl",
  NOR: "no",
  NZL: "nz",
  PAN: "pa",
  PRT: "pt",
  PRY: "py",
  QAT: "qa",
  SAU: "sa",
  SCO: "gb-sct",
  SEN: "sn",
  SWE: "se",
  TUN: "tn",
  TUR: "tr",
  URY: "uy",
  USA: "us",
  UZB: "uz",
  ZAF: "za",
};

/**
 * Returns the flagcdn.com image URL for a team's 3-letter code.
 * Width options: 20, 40, 80, 160, 320, 640, 1280, 2560.
 */
export function flagUrl(teamCode: string, width: 20 | 40 | 80 = 40): string {
  const slug = FLAG_CODES[teamCode.toUpperCase()];
  if (!slug) return "";
  return `https://flagcdn.com/w${width}/${slug}.png`;
}
