-- Fix R32 knockout bracket: match numbers are wrong (venues/teams correct but assigned wrong FIFA match IDs)
-- This script swaps both match content AND pronosticos to align with official FIFA numbering.
--
-- Mapping:
--   DB 74 → FIFA 76 | DB 75 → FIFA 74 | DB 76 → FIFA 75  (rotation)
--   DB 77 ↔ FIFA 78 | DB 78 ↔ FIFA 77                     (swap)
--   DB 81 ↔ FIFA 82 | DB 82 ↔ FIFA 81                     (swap)
--   DB 83 ↔ FIFA 84 | DB 84 ↔ FIFA 83                     (swap)
--   DB 86 → FIFA 88 | DB 87 → FIFA 86 | DB 88 → FIFA 87  (rotation)

BEGIN;

-- Step 1: Drop unique index to allow pronostico reassignment
DROP INDEX "Pronostico_partidoId_usuarioId_key";

-- Step 2: Swap match content using a single UPDATE with CASE
-- For the triple rotation 74→76, 75→74, 76→75:
--   Match ID 74 gets content from old 75 (Germany vs 3rd, Boston)
--   Match ID 75 gets content from old 76 (Winner F vs Morocco, Monterrey)
--   Match ID 76 gets content from old 74 (Brazil vs Runner-up F, Houston)
UPDATE "Partido" SET
  "localId" = CASE id
    WHEN 74 THEN 17    -- old 75's localId (Germany)
    WHEN 75 THEN 54    -- old 76's localId (Winner Group F)
    WHEN 76 THEN 9     -- old 74's localId (Brazil)
  END,
  "visitanteId" = CASE id
    WHEN 74 THEN 73    -- old 75's visitanteId (Best 3rd A/B/C/D/F)
    WHEN 75 THEN 10    -- old 76's visitanteId (Morocco)
    WHEN 76 THEN 66    -- old 74's visitanteId (Runner-up Group F)
  END,
  "dia" = CASE id
    WHEN 74 THEN '2026-06-29 20:30:00'::timestamp  -- old 75's time
    WHEN 75 THEN '2026-06-30 01:00:00'::timestamp  -- old 76's time
    WHEN 76 THEN '2026-06-29 17:00:00'::timestamp  -- old 74's time
  END,
  "lugar" = CASE id
    WHEN 74 THEN 'Gillette Stadium, Boston'    -- old 75's venue
    WHEN 75 THEN 'Estadio BBVA, Monterrey'     -- old 76's venue
    WHEN 76 THEN 'NRG Stadium, Houston'        -- old 74's venue
  END
WHERE id IN (74, 75, 76);

-- Swap 77 ↔ 78:
UPDATE "Partido" SET
  "localId" = CASE id
    WHEN 77 THEN 57    -- old 78's localId (Winner Group I)
    WHEN 78 THEN 65    -- old 77's localId (Runner-up Group E)
  END,
  "visitanteId" = CASE id
    WHEN 77 THEN 74    -- old 78's visitanteId (Best 3rd C/D/F/G/H)
    WHEN 78 THEN 69    -- old 77's visitanteId (Runner-up Group I)
  END,
  "dia" = CASE id
    WHEN 77 THEN '2026-06-30 21:00:00'::timestamp  -- old 78's time
    WHEN 78 THEN '2026-06-30 17:00:00'::timestamp  -- old 77's time
  END,
  "lugar" = CASE id
    WHEN 77 THEN 'MetLife Stadium, New York/New Jersey'  -- old 78's venue
    WHEN 78 THEN 'AT&T Stadium, Dallas'                  -- old 77's venue
  END
WHERE id IN (77, 78);

-- Swap 81 ↔ 82:
UPDATE "Partido" SET
  "localId" = CASE id
    WHEN 81 THEN 13    -- old 82's localId (United States)
    WHEN 82 THEN 55    -- old 81's localId (Winner Group G)
  END,
  "visitanteId" = CASE id
    WHEN 81 THEN 77    -- old 82's visitanteId (Best 3rd B/E/F/I/J)
    WHEN 82 THEN 78    -- old 81's visitanteId (Best 3rd A/E/H/I/J)
  END,
  "dia" = CASE id
    WHEN 81 THEN '2026-07-02 00:00:00'::timestamp  -- old 82's time
    WHEN 82 THEN '2026-07-01 20:00:00'::timestamp  -- old 81's time
  END,
  "lugar" = CASE id
    WHEN 81 THEN 'Levi''s Stadium, San Francisco Bay Area'  -- old 82's venue
    WHEN 82 THEN 'Lumen Field, Seattle'                     -- old 81's venue
  END
WHERE id IN (81, 82);

-- Swap 83 ↔ 84:
UPDATE "Partido" SET
  "localId" = CASE id
    WHEN 83 THEN 71    -- old 84's localId (Runner-up Group K)
    WHEN 84 THEN 56    -- old 83's localId (Winner Group H)
  END,
  "visitanteId" = CASE id
    WHEN 83 THEN 72    -- old 84's visitanteId (Runner-up Group L)
    WHEN 84 THEN 70    -- old 83's visitanteId (Runner-up Group J)
  END,
  "dia" = CASE id
    WHEN 83 THEN '2026-07-02 23:00:00'::timestamp  -- old 84's time
    WHEN 84 THEN '2026-07-02 19:00:00'::timestamp  -- old 83's time
  END,
  "lugar" = CASE id
    WHEN 83 THEN 'BMO Field, Toronto'           -- old 84's venue
    WHEN 84 THEN 'SoFi Stadium, Los Angeles'    -- old 83's venue
  END
WHERE id IN (83, 84);

-- Triple rotation 86→88, 87→86, 88→87:
--   Match ID 86 gets content from old 87 (Argentina vs Runner-up H, Miami)
--   Match ID 87 gets content from old 88 (Winner K vs 3rd, Kansas City)
--   Match ID 88 gets content from old 86 (Runner-up D vs Runner-up G, Dallas)
UPDATE "Partido" SET
  "localId" = CASE id
    WHEN 86 THEN 37    -- old 87's localId (Argentina)
    WHEN 87 THEN 59    -- old 88's localId (Winner Group K)
    WHEN 88 THEN 64    -- old 86's localId (Runner-up Group D)
  END,
  "visitanteId" = CASE id
    WHEN 86 THEN 68    -- old 87's visitanteId (Runner-up Group H)
    WHEN 87 THEN 80    -- old 88's visitanteId (Best 3rd D/E/I/J/L)
    WHEN 88 THEN 67    -- old 86's visitanteId (Runner-up Group G)
  END,
  "dia" = CASE id
    WHEN 86 THEN '2026-07-03 22:00:00'::timestamp  -- old 87's time
    WHEN 87 THEN '2026-07-04 01:30:00'::timestamp  -- old 88's time
    WHEN 88 THEN '2026-07-03 18:00:00'::timestamp  -- old 86's time
  END,
  "lugar" = CASE id
    WHEN 86 THEN 'Hard Rock Stadium, Miami'                -- old 87's venue
    WHEN 87 THEN 'GEHA Field at Arrowhead, Kansas City'    -- old 88's venue
    WHEN 88 THEN 'AT&T Stadium, Dallas'                    -- old 86's venue
  END
WHERE id IN (86, 87, 88);

-- Step 3: Reassign pronosticos to follow their match content
-- Rotation 74→76, 75→74, 76→75:
--   Predictions on old 74 → now belong to 76
--   Predictions on old 75 → now belong to 74
--   Predictions on old 76 → now belong to 75
UPDATE "Pronostico" SET "partidoId" = CASE "partidoId"
  WHEN 74 THEN 76
  WHEN 75 THEN 74
  WHEN 76 THEN 75
END WHERE "partidoId" IN (74, 75, 76);

-- Swap 77 ↔ 78:
UPDATE "Pronostico" SET "partidoId" = CASE "partidoId"
  WHEN 77 THEN 78
  WHEN 78 THEN 77
END WHERE "partidoId" IN (77, 78);

-- Swap 81 ↔ 82:
UPDATE "Pronostico" SET "partidoId" = CASE "partidoId"
  WHEN 81 THEN 82
  WHEN 82 THEN 81
END WHERE "partidoId" IN (81, 82);

-- Swap 83 ↔ 84:
UPDATE "Pronostico" SET "partidoId" = CASE "partidoId"
  WHEN 83 THEN 84
  WHEN 84 THEN 83
END WHERE "partidoId" IN (83, 84);

-- Rotation 86→88, 87→86, 88→87:
--   Predictions on old 86 → now belong to 88
--   Predictions on old 87 → now belong to 86
--   Predictions on old 88 → now belong to 87
UPDATE "Pronostico" SET "partidoId" = CASE "partidoId"
  WHEN 86 THEN 88
  WHEN 87 THEN 86
  WHEN 88 THEN 87
END WHERE "partidoId" IN (86, 87, 88);

-- Step 4: Recreate the unique index
CREATE UNIQUE INDEX "Pronostico_partidoId_usuarioId_key" ON "Pronostico" ("partidoId", "usuarioId");

COMMIT;
