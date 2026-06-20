-- Group Stage: Austria vs Jordan (MD1) — Jun 16 → Jun 17
UPDATE "Partido" SET dia = '2026-06-17 04:00:00+00'
WHERE "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'AUT')
  AND "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'JOR');

-- Group Stage: Tunisia vs Japan (MD2) — Jun 20 → Jun 21
UPDATE "Partido" SET dia = '2026-06-21 04:00:00+00'
WHERE "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'TUN')
  AND "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'JPN');

-- Group Stage: Türkiye vs Paraguay (MD2) — reverted to FIFA official 03:00 UTC
UPDATE "Partido" SET dia = '2026-06-20 03:00:00+00'
WHERE "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'TUR')
  AND "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'PRY');

-- Group Stage: Brazil vs Haiti (MD2) — 01:00 → 00:30 UTC (FIFA official)
UPDATE "Partido" SET dia = '2026-06-20 00:30:00+00'
WHERE "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'BRA')
  AND "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'HTI');

-- Round of 32: all 16 matches +1 hour
UPDATE "Partido" SET dia = dia + INTERVAL '1 hour'
WHERE "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'TREINTAIDOSAVOS');

-- R16 M90: W73 vs W75 — venue MetLife→Houston, time change
UPDATE "Partido" SET dia = '2026-07-04 17:00:00+00', lugar = 'NRG Stadium, Houston'
WHERE dia = '2026-07-04 20:00:00+00' AND "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'OCTAVOS');

-- R16 M89: W74 vs W76 → W74 vs W77 — venue Houston→Philadelphia
UPDATE "Partido" SET "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'W77'), dia = '2026-07-04 21:00:00+00', lugar = 'Lincoln Financial Field, Philadelphia'
WHERE dia = '2026-07-04 16:00:00+00' AND "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'OCTAVOS');

-- R16 M91: W79 vs W80 → W76 vs W78 — venue SanFran→MetLife
UPDATE "Partido" SET "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'W76'), "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'W78'), dia = '2026-07-05 20:00:00+00', lugar = 'MetLife Stadium, New York/New Jersey'
WHERE dia = '2026-07-05 18:00:00+00' AND "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'OCTAVOS');

-- R16 M92: W77 vs W78 → W79 vs W80 — venue stays Mexico City
UPDATE "Partido" SET "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'W79'), "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'W80'), dia = '2026-07-06 00:00:00+00', lugar = 'Estadio Azteca, Mexico City'
WHERE dia = '2026-07-05 23:00:00+00' AND "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'OCTAVOS');

-- R16 M93: W83 vs W84 — time +1h
UPDATE "Partido" SET dia = '2026-07-06 19:00:00+00'
WHERE dia = '2026-07-06 18:00:00+00' AND "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'OCTAVOS');

-- R16 M94: W85 vs W86 → W81 vs W82 — venue stays Seattle
UPDATE "Partido" SET "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'W81'), "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'W82'), dia = '2026-07-07 00:00:00+00', lugar = 'Lumen Field, Seattle'
WHERE dia = '2026-07-06 23:00:00+00' AND "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'OCTAVOS');

-- R16 M95: W81 vs W82 → W86 vs W88 — venue stays Atlanta
UPDATE "Partido" SET "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'W86'), "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'W88'), dia = '2026-07-07 16:00:00+00', lugar = 'Mercedes-Benz Stadium, Atlanta'
WHERE dia = '2026-07-07 18:00:00+00' AND "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'OCTAVOS');

-- R16 M96: W87 vs W88 → W85 vs W87 — venue Phila→Vancouver
UPDATE "Partido" SET "localId" = (SELECT id FROM "Equipo" WHERE codigo = 'W85'), "visitanteId" = (SELECT id FROM "Equipo" WHERE codigo = 'W87'), dia = '2026-07-07 20:00:00+00', lugar = 'BC Place, Vancouver'
WHERE dia = '2026-07-07 23:00:00+00' AND "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'OCTAVOS');

-- Quarter-finals: all 4 matches +1 hour
UPDATE "Partido" SET dia = dia + INTERVAL '1 hour'
WHERE "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'CUARTOS');

-- Semi-finals: 8pm ET → 3pm ET (-5h)
UPDATE "Partido" SET dia = dia - INTERVAL '5 hours'
WHERE "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'SEMI');

-- Third place: 2pm ET → 5pm ET (+3h)
UPDATE "Partido" SET dia = dia + INTERVAL '3 hours'
WHERE "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'TERCER');

-- Final: 2pm ET → 3pm ET (+1h)
UPDATE "Partido" SET dia = dia + INTERVAL '1 hour'
WHERE "faseId" = (SELECT id FROM "Fase" WHERE codigo = 'FINAL');
