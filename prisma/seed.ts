import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function sha256(str: string): Promise<string> {
  const data = new TextEncoder().encode(str);
  const hash = await globalThis.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function main() {
  console.log("🌱 Seeding database — FIFA World Cup 2026…");

  // ---------------------------------------------------------------------------
  // Paises (all 48 nations + a few extras)
  // Countries with registroPermitido=true are the only ones users can register with.
  // ---------------------------------------------------------------------------
  const REGISTRO_PERMITIDO = new Set(["ARG", "BRA", "CHL", "COL", "MEX", "PER"]);

  const paisesData = [
    { codigo: "MEX", nombre: "Mexico" },
    { codigo: "ZAF", nombre: "South Africa" },
    { codigo: "KOR", nombre: "South Korea" },
    { codigo: "CZE", nombre: "Czechia" },
    { codigo: "CAN", nombre: "Canada" },
    { codigo: "BIH", nombre: "Bosnia and Herzegovina" },
    { codigo: "QAT", nombre: "Qatar" },
    { codigo: "CHE", nombre: "Switzerland" },
    { codigo: "BRA", nombre: "Brazil" },
    { codigo: "MAR", nombre: "Morocco" },
    { codigo: "HTI", nombre: "Haiti" },
    { codigo: "SCO", nombre: "Scotland" },
    { codigo: "USA", nombre: "United States" },
    { codigo: "PRY", nombre: "Paraguay" },
    { codigo: "AUS", nombre: "Australia" },
    { codigo: "TUR", nombre: "Türkiye" },
    { codigo: "DEU", nombre: "Germany" },
    { codigo: "CUW", nombre: "Curaçao" },
    { codigo: "CIV", nombre: "Côte d'Ivoire" },
    { codigo: "ECU", nombre: "Ecuador" },
    { codigo: "NLD", nombre: "Netherlands" },
    { codigo: "JPN", nombre: "Japan" },
    { codigo: "TUN", nombre: "Tunisia" },
    { codigo: "SWE", nombre: "Sweden" },
    { codigo: "BEL", nombre: "Belgium" },
    { codigo: "EGY", nombre: "Egypt" },
    { codigo: "IRN", nombre: "Iran" },
    { codigo: "NZL", nombre: "New Zealand" },
    { codigo: "ESP", nombre: "Spain" },
    { codigo: "CPV", nombre: "Cabo Verde" },
    { codigo: "SAU", nombre: "Saudi Arabia" },
    { codigo: "URY", nombre: "Uruguay" },
    { codigo: "FRA", nombre: "France" },
    { codigo: "SEN", nombre: "Senegal" },
    { codigo: "NOR", nombre: "Norway" },
    { codigo: "IRQ", nombre: "Iraq" },
    { codigo: "ARG", nombre: "Argentina" },
    { codigo: "DZA", nombre: "Algeria" },
    { codigo: "AUT", nombre: "Austria" },
    { codigo: "JOR", nombre: "Jordan" },
    { codigo: "PRT", nombre: "Portugal" },
    { codigo: "UZB", nombre: "Uzbekistan" },
    { codigo: "COL", nombre: "Colombia" },
    { codigo: "COD", nombre: "DR Congo" },
    { codigo: "ENG", nombre: "England" },
    { codigo: "HRV", nombre: "Croatia" },
    { codigo: "GHA", nombre: "Ghana" },
    { codigo: "PAN", nombre: "Panama" },
    // Registration-allowed countries not in the World Cup
    { codigo: "CHL", nombre: "Chile" },
    { codigo: "PER", nombre: "Peru" },
  ];

  for (const p of paisesData) {
    const registroPermitido = REGISTRO_PERMITIDO.has(p.codigo);
    await prisma.pais.upsert({
      where: { codigo: p.codigo },
      update: { registroPermitido },
      create: { ...p, registroPermitido },
    });
  }
  console.log(`  ✔ ${paisesData.length} countries (${REGISTRO_PERMITIDO.size} with registration enabled)`);

  // ---------------------------------------------------------------------------
  // Fases
  // ---------------------------------------------------------------------------
  const fasesData = [
    { codigo: "GRUPO", nombre: "Group Stage", puntos: 1 },
    { codigo: "TREINTAIDOSAVOS", nombre: "Round of 32", puntos: 2 },
    { codigo: "OCTAVOS", nombre: "Round of 16", puntos: 3 },
    { codigo: "CUARTOS", nombre: "Quarter-finals", puntos: 4 },
    { codigo: "SEMI", nombre: "Semi-finals", puntos: 5 },
    { codigo: "TERCER", nombre: "3rd Place", puntos: 6 },
    { codigo: "FINAL", nombre: "Final", puntos: 6 },
  ];

  for (const f of fasesData) {
    await prisma.fase.upsert({
      where: { codigo: f.codigo },
      update: { nombre: f.nombre, puntos: f.puntos },
      create: f,
    });
  }
  console.log(`  ✔ ${fasesData.length} phases`);

  // ---------------------------------------------------------------------------
  // Grupos — 12 groups (A–L) for the expanded 48-team format
  // ---------------------------------------------------------------------------
  const gruposLetras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  const gruposData = gruposLetras.map((l) => ({
    codigo: `GRUPO_${l}`,
    nombre: `Group ${l}`,
  }));
  gruposData.push({ codigo: "NONE", nombre: "No Group" });

  for (const g of gruposData) {
    await prisma.grupo.upsert({
      where: { codigo: g.codigo },
      update: {},
      create: g,
    });
  }
  console.log(`  ✔ ${gruposData.length} groups`);

  // ---------------------------------------------------------------------------
  // Equipos — all 48 teams, FIFA World Cup 2026
  // ---------------------------------------------------------------------------
  const equiposData = [
    // Group A
    { codigo: "MEX", nombre: "Mexico", logo: "" },
    { codigo: "ZAF", nombre: "South Africa", logo: "" },
    { codigo: "KOR", nombre: "Korea Republic", logo: "" },
    { codigo: "CZE", nombre: "Czechia", logo: "" },
    // Group B
    { codigo: "CAN", nombre: "Canada", logo: "" },
    { codigo: "BIH", nombre: "Bosnia and Herzegovina", logo: "" },
    { codigo: "QAT", nombre: "Qatar", logo: "" },
    { codigo: "CHE", nombre: "Switzerland", logo: "" },
    // Group C
    { codigo: "BRA", nombre: "Brazil", logo: "" },
    { codigo: "MAR", nombre: "Morocco", logo: "" },
    { codigo: "HTI", nombre: "Haiti", logo: "" },
    { codigo: "SCO", nombre: "Scotland", logo: "" },
    // Group D
    { codigo: "USA", nombre: "United States", logo: "" },
    { codigo: "PRY", nombre: "Paraguay", logo: "" },
    { codigo: "AUS", nombre: "Australia", logo: "" },
    { codigo: "TUR", nombre: "Türkiye", logo: "" },
    // Group E
    { codigo: "DEU", nombre: "Germany", logo: "" },
    { codigo: "CUW", nombre: "Curaçao", logo: "" },
    { codigo: "CIV", nombre: "Côte d'Ivoire", logo: "" },
    { codigo: "ECU", nombre: "Ecuador", logo: "" },
    // Group F
    { codigo: "NLD", nombre: "Netherlands", logo: "" },
    { codigo: "JPN", nombre: "Japan", logo: "" },
    { codigo: "TUN", nombre: "Tunisia", logo: "" },
    { codigo: "SWE", nombre: "Sweden", logo: "" },
    // Group G
    { codigo: "BEL", nombre: "Belgium", logo: "" },
    { codigo: "EGY", nombre: "Egypt", logo: "" },
    { codigo: "IRN", nombre: "Iran", logo: "" },
    { codigo: "NZL", nombre: "New Zealand", logo: "" },
    // Group H
    { codigo: "ESP", nombre: "Spain", logo: "" },
    { codigo: "CPV", nombre: "Cabo Verde", logo: "" },
    { codigo: "SAU", nombre: "Saudi Arabia", logo: "" },
    { codigo: "URY", nombre: "Uruguay", logo: "" },
    // Group I
    { codigo: "FRA", nombre: "France", logo: "" },
    { codigo: "SEN", nombre: "Senegal", logo: "" },
    { codigo: "NOR", nombre: "Norway", logo: "" },
    { codigo: "IRQ", nombre: "Iraq", logo: "" },
    // Group J
    { codigo: "ARG", nombre: "Argentina", logo: "" },
    { codigo: "DZA", nombre: "Algeria", logo: "" },
    { codigo: "AUT", nombre: "Austria", logo: "" },
    { codigo: "JOR", nombre: "Jordan", logo: "" },
    // Group K
    { codigo: "PRT", nombre: "Portugal", logo: "" },
    { codigo: "UZB", nombre: "Uzbekistan", logo: "" },
    { codigo: "COL", nombre: "Colombia", logo: "" },
    { codigo: "COD", nombre: "DR Congo", logo: "" },
    // Group L
    { codigo: "ENG", nombre: "England", logo: "" },
    { codigo: "HRV", nombre: "Croatia", logo: "" },
    { codigo: "GHA", nombre: "Ghana", logo: "" },
    { codigo: "PAN", nombre: "Panama", logo: "" },
  ];

  for (const e of equiposData) {
    await prisma.equipo.upsert({
      where: { codigo: e.codigo },
      update: {},
      create: e,
    });
  }
  console.log(`  ✔ ${equiposData.length} teams`);

  // ---------------------------------------------------------------------------
  // Placeholder teams for knockout stage positions
  // ---------------------------------------------------------------------------
  const knockoutTeamsData = [
    // Group winners
    ...["A","B","C","D","E","F","G","H","I","J","K","L"].map((g) => ({
      codigo: `1${g}`, nombre: `Winner Group ${g}`, logo: "",
    })),
    // Group runners-up
    ...["A","B","C","D","E","F","G","H","I","J","K","L"].map((g) => ({
      codigo: `2${g}`, nombre: `Runner-up Group ${g}`, logo: "",
    })),
    // Best 3rd-placed team slots (one per group-winner match that needs a 3rd)
    { codigo: "3T74", nombre: "Best 3rd (A/B/C/D/F)", logo: "" },
    { codigo: "3T77", nombre: "Best 3rd (C/D/F/G/H)", logo: "" },
    { codigo: "3T79", nombre: "Best 3rd (C/E/F/H/I)", logo: "" },
    { codigo: "3T80", nombre: "Best 3rd (E/H/I/J/K)", logo: "" },
    { codigo: "3T81", nombre: "Best 3rd (B/E/F/I/J)", logo: "" },
    { codigo: "3T82", nombre: "Best 3rd (A/E/H/I/J)", logo: "" },
    { codigo: "3T85", nombre: "Best 3rd (E/F/G/I/J)", logo: "" },
    { codigo: "3T87", nombre: "Best 3rd (D/E/I/J/L)", logo: "" },
    // Round of 32 winners → used as participants in Round of 16
    ...[73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88].map((n) => ({
      codigo: `W${n}`, nombre: `Winner Match ${n}`, logo: "",
    })),
    // Round of 16 winners → used as participants in Quarter-finals
    ...[89,90,91,92,93,94,95,96].map((n) => ({
      codigo: `W${n}`, nombre: `Winner Match ${n}`, logo: "",
    })),
    // Quarter-final winners → used as participants in Semi-finals
    ...[97,98,99,100].map((n) => ({
      codigo: `W${n}`, nombre: `Winner Match ${n}`, logo: "",
    })),
    // Semi-final winners → Final participants
    { codigo: "W101", nombre: "Winner Match 101", logo: "" },
    { codigo: "W102", nombre: "Winner Match 102", logo: "" },
    // Semi-final losers → 3rd Place match participants
    { codigo: "L101", nombre: "Loser Match 101", logo: "" },
    { codigo: "L102", nombre: "Loser Match 102", logo: "" },
  ];

  for (const e of knockoutTeamsData) {
    await prisma.equipo.upsert({
      where: { codigo: e.codigo },
      update: {},
      create: e,
    });
  }
  console.log(`  ✔ ${knockoutTeamsData.length} knockout placeholder teams`);

  // ---------------------------------------------------------------------------
  // Partidos — all 72 group stage matches
  // Dates in UTC (source times are EDT; converted by adding 4 h).
  // ---------------------------------------------------------------------------
  const faseGrupo = await prisma.fase.findUnique({ where: { codigo: "GRUPO" } });
  if (!faseGrupo) throw new Error("Fase GRUPO not found");

  const grupoStageCount = await prisma.partido.count({ where: { faseId: faseGrupo.id } });
  if (grupoStageCount > 0) {
    console.log(`  ℹ Group stage matches already seeded (${grupoStageCount}), skipping`);
  } else {
    // Fetch lookup maps
    const equipoMap = await prisma.equipo
      .findMany()
      .then((es) => Object.fromEntries(es.map((e) => [e.codigo, e])));
    const grupoMap = await prisma.grupo
      .findMany()
      .then((gs) => Object.fromEntries(gs.map((g) => [g.codigo, g])));

    type PartidoInput = {
      local: string;
      visitante: string;
      grupo: string;
      dia: Date;
      lugar: string;
      fecha: number;
    };

    // All 72 group stage fixtures
    // MD1 = matchday 1 (fecha 1), MD2 = matchday 2, MD3 = matchday 3
    // All times UTC. Source: official FIFA schedule (ET kickoffs converted with +4h).
    const partidosData: PartidoInput[] = [
      // ── MATCHDAY 1 ─────────────────────────────────────────────────────────
      // Group A
      { local: "MEX", visitante: "ZAF", grupo: "GRUPO_A", dia: new Date("2026-06-11T19:00:00Z"), lugar: "Estadio Azteca, Mexico City", fecha: 1 },
      { local: "KOR", visitante: "CZE", grupo: "GRUPO_A", dia: new Date("2026-06-12T02:00:00Z"), lugar: "Estadio Akron, Guadalajara", fecha: 1 },
      // Group B
      { local: "CAN", visitante: "BIH", grupo: "GRUPO_B", dia: new Date("2026-06-12T19:00:00Z"), lugar: "BMO Field, Toronto", fecha: 1 },
      { local: "QAT", visitante: "CHE", grupo: "GRUPO_B", dia: new Date("2026-06-13T19:00:00Z"), lugar: "Levi's Stadium, San Francisco Bay Area", fecha: 1 },
      // Group C
      { local: "BRA", visitante: "MAR", grupo: "GRUPO_C", dia: new Date("2026-06-13T22:00:00Z"), lugar: "MetLife Stadium, New York/New Jersey", fecha: 1 },
      { local: "HTI", visitante: "SCO", grupo: "GRUPO_C", dia: new Date("2026-06-14T01:00:00Z"), lugar: "Gillette Stadium, Boston", fecha: 1 },
      // Group D
      { local: "USA", visitante: "PRY", grupo: "GRUPO_D", dia: new Date("2026-06-13T01:00:00Z"), lugar: "SoFi Stadium, Los Angeles", fecha: 1 },
      { local: "AUS", visitante: "TUR", grupo: "GRUPO_D", dia: new Date("2026-06-14T04:00:00Z"), lugar: "BC Place, Vancouver", fecha: 1 },
      // Group E
      { local: "DEU", visitante: "CUW", grupo: "GRUPO_E", dia: new Date("2026-06-14T17:00:00Z"), lugar: "NRG Stadium, Houston", fecha: 1 },
      { local: "CIV", visitante: "ECU", grupo: "GRUPO_E", dia: new Date("2026-06-14T23:00:00Z"), lugar: "Lincoln Financial Field, Philadelphia", fecha: 1 },
      // Group F
      { local: "NLD", visitante: "JPN", grupo: "GRUPO_F", dia: new Date("2026-06-14T20:00:00Z"), lugar: "AT&T Stadium, Dallas", fecha: 1 },
      { local: "SWE", visitante: "TUN", grupo: "GRUPO_F", dia: new Date("2026-06-15T02:00:00Z"), lugar: "Estadio BBVA, Monterrey", fecha: 1 },
      // Group G
      { local: "BEL", visitante: "EGY", grupo: "GRUPO_G", dia: new Date("2026-06-15T19:00:00Z"), lugar: "Lumen Field, Seattle", fecha: 1 },
      { local: "IRN", visitante: "NZL", grupo: "GRUPO_G", dia: new Date("2026-06-16T01:00:00Z"), lugar: "SoFi Stadium, Los Angeles", fecha: 1 },
      // Group H
      { local: "ESP", visitante: "CPV", grupo: "GRUPO_H", dia: new Date("2026-06-15T16:00:00Z"), lugar: "Mercedes-Benz Stadium, Atlanta", fecha: 1 },
      { local: "SAU", visitante: "URY", grupo: "GRUPO_H", dia: new Date("2026-06-15T22:00:00Z"), lugar: "Hard Rock Stadium, Miami", fecha: 1 },
      // Group I
      { local: "FRA", visitante: "SEN", grupo: "GRUPO_I", dia: new Date("2026-06-16T19:00:00Z"), lugar: "MetLife Stadium, New York/New Jersey", fecha: 1 },
      { local: "IRQ", visitante: "NOR", grupo: "GRUPO_I", dia: new Date("2026-06-16T22:00:00Z"), lugar: "Gillette Stadium, Boston", fecha: 1 },
      // Group J
      { local: "ARG", visitante: "DZA", grupo: "GRUPO_J", dia: new Date("2026-06-17T01:00:00Z"), lugar: "Arrowhead Stadium, Kansas City", fecha: 1 },
      { local: "AUT", visitante: "JOR", grupo: "GRUPO_J", dia: new Date("2026-06-17T04:00:00Z"), lugar: "Levi's Stadium, San Francisco Bay Area", fecha: 1 },
      // Group K
      { local: "PRT", visitante: "COD", grupo: "GRUPO_K", dia: new Date("2026-06-17T17:00:00Z"), lugar: "NRG Stadium, Houston", fecha: 1 },
      { local: "UZB", visitante: "COL", grupo: "GRUPO_K", dia: new Date("2026-06-18T02:00:00Z"), lugar: "Estadio Azteca, Mexico City", fecha: 1 },
      // Group L
      { local: "ENG", visitante: "HRV", grupo: "GRUPO_L", dia: new Date("2026-06-17T20:00:00Z"), lugar: "AT&T Stadium, Dallas", fecha: 1 },
      { local: "GHA", visitante: "PAN", grupo: "GRUPO_L", dia: new Date("2026-06-17T23:00:00Z"), lugar: "BMO Field, Toronto", fecha: 1 },

      // ── MATCHDAY 2 ─────────────────────────────────────────────────────────
      // Group A
      { local: "CZE", visitante: "ZAF", grupo: "GRUPO_A", dia: new Date("2026-06-18T16:00:00Z"), lugar: "Mercedes-Benz Stadium, Atlanta", fecha: 2 },
      { local: "MEX", visitante: "KOR", grupo: "GRUPO_A", dia: new Date("2026-06-19T01:00:00Z"), lugar: "Estadio Akron, Guadalajara", fecha: 2 },
      // Group B
      { local: "CHE", visitante: "BIH", grupo: "GRUPO_B", dia: new Date("2026-06-18T19:00:00Z"), lugar: "SoFi Stadium, Los Angeles", fecha: 2 },
      { local: "CAN", visitante: "QAT", grupo: "GRUPO_B", dia: new Date("2026-06-18T22:00:00Z"), lugar: "BC Place, Vancouver", fecha: 2 },
      // Group C
      { local: "SCO", visitante: "MAR", grupo: "GRUPO_C", dia: new Date("2026-06-19T22:00:00Z"), lugar: "Gillette Stadium, Boston", fecha: 2 },
      { local: "BRA", visitante: "HTI", grupo: "GRUPO_C", dia: new Date("2026-06-20T01:00:00Z"), lugar: "Lincoln Financial Field, Philadelphia", fecha: 2 },
      // Group D
      { local: "USA", visitante: "AUS", grupo: "GRUPO_D", dia: new Date("2026-06-19T19:00:00Z"), lugar: "Lumen Field, Seattle", fecha: 2 },
      { local: "TUR", visitante: "PRY", grupo: "GRUPO_D", dia: new Date("2026-06-20T04:00:00Z"), lugar: "Levi's Stadium, San Francisco Bay Area", fecha: 2 },
      // Group E
      { local: "DEU", visitante: "CIV", grupo: "GRUPO_E", dia: new Date("2026-06-20T20:00:00Z"), lugar: "BMO Field, Toronto", fecha: 2 },
      { local: "ECU", visitante: "CUW", grupo: "GRUPO_E", dia: new Date("2026-06-21T00:00:00Z"), lugar: "Arrowhead Stadium, Kansas City", fecha: 2 },
      // Group F
      { local: "NLD", visitante: "SWE", grupo: "GRUPO_F", dia: new Date("2026-06-20T17:00:00Z"), lugar: "NRG Stadium, Houston", fecha: 2 },
      { local: "TUN", visitante: "JPN", grupo: "GRUPO_F", dia: new Date("2026-06-21T04:00:00Z"), lugar: "Estadio BBVA, Monterrey", fecha: 2 },
      // Group G
      { local: "BEL", visitante: "IRN", grupo: "GRUPO_G", dia: new Date("2026-06-21T19:00:00Z"), lugar: "SoFi Stadium, Los Angeles", fecha: 2 },
      { local: "NZL", visitante: "EGY", grupo: "GRUPO_G", dia: new Date("2026-06-22T01:00:00Z"), lugar: "BC Place, Vancouver", fecha: 2 },
      // Group H
      { local: "ESP", visitante: "SAU", grupo: "GRUPO_H", dia: new Date("2026-06-21T16:00:00Z"), lugar: "Mercedes-Benz Stadium, Atlanta", fecha: 2 },
      { local: "URY", visitante: "CPV", grupo: "GRUPO_H", dia: new Date("2026-06-21T22:00:00Z"), lugar: "Hard Rock Stadium, Miami", fecha: 2 },
      // Group I
      { local: "NOR", visitante: "SEN", grupo: "GRUPO_I", dia: new Date("2026-06-23T00:00:00Z"), lugar: "MetLife Stadium, New York/New Jersey", fecha: 2 },
      { local: "FRA", visitante: "IRQ", grupo: "GRUPO_I", dia: new Date("2026-06-22T21:00:00Z"), lugar: "Lincoln Financial Field, Philadelphia", fecha: 2 },
      // Group J
      { local: "ARG", visitante: "AUT", grupo: "GRUPO_J", dia: new Date("2026-06-22T17:00:00Z"), lugar: "AT&T Stadium, Dallas", fecha: 2 },
      { local: "JOR", visitante: "DZA", grupo: "GRUPO_J", dia: new Date("2026-06-23T03:00:00Z"), lugar: "Levi's Stadium, San Francisco Bay Area", fecha: 2 },
      // Group K
      { local: "PRT", visitante: "UZB", grupo: "GRUPO_K", dia: new Date("2026-06-23T17:00:00Z"), lugar: "NRG Stadium, Houston", fecha: 2 },
      { local: "COL", visitante: "COD", grupo: "GRUPO_K", dia: new Date("2026-06-24T02:00:00Z"), lugar: "Estadio Akron, Guadalajara", fecha: 2 },
      // Group L
      { local: "ENG", visitante: "GHA", grupo: "GRUPO_L", dia: new Date("2026-06-23T20:00:00Z"), lugar: "Gillette Stadium, Boston", fecha: 2 },
      { local: "PAN", visitante: "HRV", grupo: "GRUPO_L", dia: new Date("2026-06-23T23:00:00Z"), lugar: "BMO Field, Toronto", fecha: 2 },

      // ── MATCHDAY 3 ─────────────────────────────────────────────────────────
      // Group A (simultaneous)
      { local: "CZE", visitante: "MEX", grupo: "GRUPO_A", dia: new Date("2026-06-25T01:00:00Z"), lugar: "Estadio Azteca, Mexico City", fecha: 3 },
      { local: "ZAF", visitante: "KOR", grupo: "GRUPO_A", dia: new Date("2026-06-25T01:00:00Z"), lugar: "Estadio BBVA, Monterrey", fecha: 3 },
      // Group B (simultaneous)
      { local: "CHE", visitante: "CAN", grupo: "GRUPO_B", dia: new Date("2026-06-24T19:00:00Z"), lugar: "BC Place, Vancouver", fecha: 3 },
      { local: "BIH", visitante: "QAT", grupo: "GRUPO_B", dia: new Date("2026-06-24T19:00:00Z"), lugar: "Lumen Field, Seattle", fecha: 3 },
      // Group C (simultaneous)
      { local: "SCO", visitante: "BRA", grupo: "GRUPO_C", dia: new Date("2026-06-24T22:00:00Z"), lugar: "Hard Rock Stadium, Miami", fecha: 3 },
      { local: "MAR", visitante: "HTI", grupo: "GRUPO_C", dia: new Date("2026-06-24T22:00:00Z"), lugar: "Mercedes-Benz Stadium, Atlanta", fecha: 3 },
      // Group D (simultaneous)
      { local: "TUR", visitante: "USA", grupo: "GRUPO_D", dia: new Date("2026-06-26T02:00:00Z"), lugar: "SoFi Stadium, Los Angeles", fecha: 3 },
      { local: "PRY", visitante: "AUS", grupo: "GRUPO_D", dia: new Date("2026-06-26T02:00:00Z"), lugar: "Levi's Stadium, San Francisco Bay Area", fecha: 3 },
      // Group E (simultaneous)
      { local: "CUW", visitante: "CIV", grupo: "GRUPO_E", dia: new Date("2026-06-25T20:00:00Z"), lugar: "Lincoln Financial Field, Philadelphia", fecha: 3 },
      { local: "ECU", visitante: "DEU", grupo: "GRUPO_E", dia: new Date("2026-06-25T20:00:00Z"), lugar: "MetLife Stadium, New York/New Jersey", fecha: 3 },
      // Group F (simultaneous)
      { local: "JPN", visitante: "SWE", grupo: "GRUPO_F", dia: new Date("2026-06-25T23:00:00Z"), lugar: "AT&T Stadium, Dallas", fecha: 3 },
      { local: "TUN", visitante: "NLD", grupo: "GRUPO_F", dia: new Date("2026-06-25T23:00:00Z"), lugar: "Arrowhead Stadium, Kansas City", fecha: 3 },
      // Group G (simultaneous)
      { local: "EGY", visitante: "IRN", grupo: "GRUPO_G", dia: new Date("2026-06-27T03:00:00Z"), lugar: "Lumen Field, Seattle", fecha: 3 },
      { local: "NZL", visitante: "BEL", grupo: "GRUPO_G", dia: new Date("2026-06-27T03:00:00Z"), lugar: "BC Place, Vancouver", fecha: 3 },
      // Group H (simultaneous)
      { local: "CPV", visitante: "SAU", grupo: "GRUPO_H", dia: new Date("2026-06-27T00:00:00Z"), lugar: "NRG Stadium, Houston", fecha: 3 },
      { local: "URY", visitante: "ESP", grupo: "GRUPO_H", dia: new Date("2026-06-27T00:00:00Z"), lugar: "Estadio Akron, Guadalajara", fecha: 3 },
      // Group I (simultaneous)
      { local: "NOR", visitante: "FRA", grupo: "GRUPO_I", dia: new Date("2026-06-26T19:00:00Z"), lugar: "Gillette Stadium, Boston", fecha: 3 },
      { local: "SEN", visitante: "IRQ", grupo: "GRUPO_I", dia: new Date("2026-06-26T19:00:00Z"), lugar: "BMO Field, Toronto", fecha: 3 },
      // Group J (simultaneous)
      { local: "DZA", visitante: "AUT", grupo: "GRUPO_J", dia: new Date("2026-06-28T02:00:00Z"), lugar: "Arrowhead Stadium, Kansas City", fecha: 3 },
      { local: "JOR", visitante: "ARG", grupo: "GRUPO_J", dia: new Date("2026-06-28T02:00:00Z"), lugar: "AT&T Stadium, Dallas", fecha: 3 },
      // Group K (simultaneous)
      { local: "COL", visitante: "PRT", grupo: "GRUPO_K", dia: new Date("2026-06-27T23:30:00Z"), lugar: "Hard Rock Stadium, Miami", fecha: 3 },
      { local: "COD", visitante: "UZB", grupo: "GRUPO_K", dia: new Date("2026-06-27T23:30:00Z"), lugar: "Mercedes-Benz Stadium, Atlanta", fecha: 3 },
      // Group L (simultaneous)
      { local: "PAN", visitante: "ENG", grupo: "GRUPO_L", dia: new Date("2026-06-27T21:00:00Z"), lugar: "MetLife Stadium, New York/New Jersey", fecha: 3 },
      { local: "HRV", visitante: "GHA", grupo: "GRUPO_L", dia: new Date("2026-06-27T21:00:00Z"), lugar: "Lincoln Financial Field, Philadelphia", fecha: 3 },
    ];

    const createdPartidos = await prisma.partido.createMany({
      data: partidosData.map((p) => ({
        localId: equipoMap[p.local].id,
        visitanteId: equipoMap[p.visitante].id,
        grupoId: grupoMap[p.grupo].id,
        faseId: faseGrupo.id,
        dia: p.dia,
        lugar: p.lugar,
        fecha: p.fecha,
      })),
    });
    console.log(`  ✔ ${createdPartidos.count} group stage matches`);
  }

  // ---------------------------------------------------------------------------
  // Partidos — knockout stage (Round of 32 → Final) with placeholder teams
  // All times UTC (EDT +4 h). Sources: FIFA.com, Wikipedia, KickoffAdventures.
  // ---------------------------------------------------------------------------
  const knockoutCount = await prisma.partido.count({
    where: { fase: { codigo: { not: "GRUPO" } } },
  });
  if (knockoutCount > 0) {
    console.log(`  ℹ Knockout stage matches already seeded (${knockoutCount}), skipping`);
  } else {
    const allEquipoMap = await prisma.equipo
      .findMany()
      .then((es) => Object.fromEntries(es.map((e) => [e.codigo, e])));
    const faseMap = await prisma.fase
      .findMany()
      .then((fs) => Object.fromEntries(fs.map((f) => [f.codigo, f])));
    const noneGrupo = await prisma.grupo.findUnique({ where: { codigo: "NONE" } });
    if (!noneGrupo) throw new Error("Grupo NONE not found");

    type KnockoutInput = {
      local: string;
      visitante: string;
      fase: string;
      dia: Date;
      lugar: string;
    };

    // ── Round of 32 (matches 73–88) ──────────────────────────────────────────
    const r32Data: KnockoutInput[] = [
      // Jun 28
      { local: "2A",   visitante: "2B",   fase: "TREINTAIDOSAVOS", dia: new Date("2026-06-28T19:00:00Z"), lugar: "SoFi Stadium, Los Angeles" },
      // Jun 29
      { local: "1C",   visitante: "2F",   fase: "TREINTAIDOSAVOS", dia: new Date("2026-06-29T17:00:00Z"), lugar: "NRG Stadium, Houston" },
      { local: "1E",   visitante: "3T74", fase: "TREINTAIDOSAVOS", dia: new Date("2026-06-29T20:30:00Z"), lugar: "Gillette Stadium, Boston" },
      { local: "1F",   visitante: "2C",   fase: "TREINTAIDOSAVOS", dia: new Date("2026-06-30T01:00:00Z"), lugar: "Estadio BBVA, Monterrey" },
      // Jun 30
      { local: "2E",   visitante: "2I",   fase: "TREINTAIDOSAVOS", dia: new Date("2026-06-30T17:00:00Z"), lugar: "AT&T Stadium, Dallas" },
      { local: "1I",   visitante: "3T77", fase: "TREINTAIDOSAVOS", dia: new Date("2026-06-30T21:00:00Z"), lugar: "MetLife Stadium, New York/New Jersey" },
      { local: "1A",   visitante: "3T79", fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-01T01:00:00Z"), lugar: "Estadio Azteca, Mexico City" },
      // Jul 1
      { local: "1L",   visitante: "3T80", fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-01T16:00:00Z"), lugar: "Mercedes-Benz Stadium, Atlanta" },
      { local: "1G",   visitante: "3T82", fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-01T20:00:00Z"), lugar: "Lumen Field, Seattle" },
      { local: "1D",   visitante: "3T81", fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-02T00:00:00Z"), lugar: "Levi's Stadium, San Francisco Bay Area" },
      // Jul 2
      { local: "1H",   visitante: "2J",   fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-02T19:00:00Z"), lugar: "SoFi Stadium, Los Angeles" },
      { local: "2K",   visitante: "2L",   fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-02T23:00:00Z"), lugar: "BMO Field, Toronto" },
      { local: "1B",   visitante: "3T85", fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-03T03:00:00Z"), lugar: "BC Place, Vancouver" },
      // Jul 3
      { local: "2D",   visitante: "2G",   fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-03T18:00:00Z"), lugar: "AT&T Stadium, Dallas" },
      { local: "1J",   visitante: "2H",   fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-03T22:00:00Z"), lugar: "Hard Rock Stadium, Miami" },
      { local: "1K",   visitante: "3T87", fase: "TREINTAIDOSAVOS", dia: new Date("2026-07-04T01:30:00Z"), lugar: "GEHA Field at Arrowhead, Kansas City" },
    ];

    // ── Round of 16 (matches 89–96) ───────────────────────────────────────────
    // Bracket: W73 vs W75 → M90, W74 vs W77 → M89, W76 vs W78 → M91,
    //          W79 vs W80 → M92, W83 vs W84 → M93, W81 vs W82 → M94,
    //          W86 vs W88 → M95, W85 vs W87 → M96
    const r16Data: KnockoutInput[] = [
      // Jul 4
      { local: "W73", visitante: "W75", fase: "OCTAVOS", dia: new Date("2026-07-04T17:00:00Z"), lugar: "NRG Stadium, Houston" },
      { local: "W74", visitante: "W77", fase: "OCTAVOS", dia: new Date("2026-07-04T21:00:00Z"), lugar: "Lincoln Financial Field, Philadelphia" },
      // Jul 5
      { local: "W76", visitante: "W78", fase: "OCTAVOS", dia: new Date("2026-07-05T20:00:00Z"), lugar: "MetLife Stadium, New York/New Jersey" },
      { local: "W79", visitante: "W80", fase: "OCTAVOS", dia: new Date("2026-07-06T00:00:00Z"), lugar: "Estadio Azteca, Mexico City" },
      // Jul 6
      { local: "W83", visitante: "W84", fase: "OCTAVOS", dia: new Date("2026-07-06T19:00:00Z"), lugar: "AT&T Stadium, Dallas" },
      { local: "W81", visitante: "W82", fase: "OCTAVOS", dia: new Date("2026-07-07T00:00:00Z"), lugar: "Lumen Field, Seattle" },
      // Jul 7
      { local: "W86", visitante: "W88", fase: "OCTAVOS", dia: new Date("2026-07-07T16:00:00Z"), lugar: "Mercedes-Benz Stadium, Atlanta" },
      { local: "W85", visitante: "W87", fase: "OCTAVOS", dia: new Date("2026-07-07T20:00:00Z"), lugar: "BC Place, Vancouver" },
    ];

    // ── Quarter-finals (matches 97–100) ───────────────────────────────────────
    // QF1 = W89 vs W90, QF2 = W93 vs W94, QF3 = W91 vs W92, QF4 = W95 vs W96
    const qfData: KnockoutInput[] = [
      { local: "W89", visitante: "W90", fase: "CUARTOS", dia: new Date("2026-07-09T20:00:00Z"), lugar: "Gillette Stadium, Boston" },
      { local: "W93", visitante: "W94", fase: "CUARTOS", dia: new Date("2026-07-10T19:00:00Z"), lugar: "SoFi Stadium, Los Angeles" },
      { local: "W91", visitante: "W92", fase: "CUARTOS", dia: new Date("2026-07-11T21:00:00Z"), lugar: "Hard Rock Stadium, Miami" },
      { local: "W95", visitante: "W96", fase: "CUARTOS", dia: new Date("2026-07-12T01:00:00Z"), lugar: "GEHA Field at Arrowhead, Kansas City" },
    ];

    // ── Semi-finals (matches 101–102) ─────────────────────────────────────────
    const sfData: KnockoutInput[] = [
      { local: "W97",  visitante: "W98",  fase: "SEMI", dia: new Date("2026-07-14T19:00:00Z"), lugar: "AT&T Stadium, Dallas" },
      { local: "W99",  visitante: "W100", fase: "SEMI", dia: new Date("2026-07-15T19:00:00Z"), lugar: "Mercedes-Benz Stadium, Atlanta" },
    ];

    // ── 3rd Place (match 103) ─────────────────────────────────────────────────
    const thirdData: KnockoutInput[] = [
      { local: "L101", visitante: "L102", fase: "TERCER", dia: new Date("2026-07-18T21:00:00Z"), lugar: "Hard Rock Stadium, Miami" },
    ];

    // ── Final (match 104) ─────────────────────────────────────────────────────
    const finalData: KnockoutInput[] = [
      { local: "W101", visitante: "W102", fase: "FINAL", dia: new Date("2026-07-19T19:00:00Z"), lugar: "MetLife Stadium, East Rutherford" },
    ];

    const allKnockout = [...r32Data, ...r16Data, ...qfData, ...sfData, ...thirdData, ...finalData];

    const createdKnockout = await prisma.partido.createMany({
      data: allKnockout.map((m) => ({
        localId: allEquipoMap[m.local].id,
        visitanteId: allEquipoMap[m.visitante].id,
        grupoId: noneGrupo.id,
        faseId: faseMap[m.fase].id,
        dia: m.dia,
        lugar: m.lugar,
        fecha: 1,
      })),
    });
    console.log(`  ✔ ${createdKnockout.count} knockout stage matches`);
  }

  // ---------------------------------------------------------------------------
  // Preguntas Secretas (Secret Questions)
  // ---------------------------------------------------------------------------
  const preguntasData = [
    { codigo: "PRIMERA_MASCOTA", pregunta: "What was the name of your first pet?" },
    { codigo: "CIUDAD_NACIMIENTO", pregunta: "In what city were you born?" },
    { codigo: "APELLIDO_MADRE", pregunta: "What is your mother's maiden name?" },
    { codigo: "EQUIPO_FAVORITO", pregunta: "What is your favorite sports team?" },
    { codigo: "APODO_INFANCIA", pregunta: "What was your childhood nickname?" },
    { codigo: "PELICULA_FAVORITA", pregunta: "What is your favorite movie?" },
  ];
  for (const q of preguntasData) {
    await prisma.preguntaSecreta.upsert({
      where: { codigo: q.codigo },
      update: {},
      create: q,
    });
  }
  console.log(`  ✔ ${preguntasData.length} secret questions`);

  // ---------------------------------------------------------------------------
  // Admin user
  // ---------------------------------------------------------------------------
  const adminPais = await prisma.pais.findUnique({ where: { codigo: "ARG" } });
  await prisma.usuario.upsert({
    where: { email: "admin@openscore.com" },
    update: {},
    create: {
      nombre: "Admin",
      apellido: "Openscore",
      email: "admin@openscore.com",
      password: await sha256("admin123"),
      paisId: adminPais!.id,
      roles: { create: [{ rol: "ADMIN" }, { rol: "USUARIO" }] },
    },
  });

  console.log("✅ Seed complete");
  console.log("   Admin credentials: admin@openscore.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
