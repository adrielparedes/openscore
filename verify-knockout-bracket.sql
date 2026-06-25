-- Verification: After running fix-knockout-bracket.sql, this query should show
-- the R32 matches aligned with official FIFA numbering.
--
-- Expected mapping (FIFA official):
--   73: Runner-up A vs Runner-up B
--   74: Winner E vs 3rd (A/B/C/D/F)        → Boston
--   75: Winner F vs Runner-up C             → Monterrey
--   76: Winner C vs Runner-up F             → Houston
--   77: Winner I vs 3rd (C/D/F/G/H)        → NY/NJ
--   78: Runner-up E vs Runner-up I          → Dallas
--   79: Winner A vs 3rd (C/E/F/H/I)        → Mexico City
--   80: Winner L vs 3rd (E/H/I/J/K)        → Atlanta
--   81: Winner D vs 3rd (B/E/F/I/J)        → San Francisco
--   82: Winner G vs 3rd (A/E/H/I/J)        → Seattle
--   83: Runner-up K vs Runner-up L          → Toronto
--   84: Winner H vs Runner-up J             → Los Angeles
--   85: Winner B vs 3rd (E/F/G/I/J)        → Vancouver
--   86: Winner J vs Runner-up H             → Miami
--   87: Winner K vs 3rd (D/E/I/J/L)        → Kansas City
--   88: Runner-up D vs Runner-up G          → Dallas

SELECT p.id as match_id, el.nombre as local, ev.nombre as visitante, p.dia, p.lugar
FROM "Partido" p
JOIN "Equipo" el ON p."localId" = el.id
JOIN "Equipo" ev ON p."visitanteId" = ev.id
WHERE p."faseId" = 2 AND p.deleted = false
ORDER BY p.id;
