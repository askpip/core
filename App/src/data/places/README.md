# Places

Region outlines and names the app uses to work out where a plant is, so that a
local statement is shown only in the place its source names (Pip Knowledge
Rules, rule 4; standing decision "Places inside a country", 6 October 2026).

Nothing here is sent anywhere. A plant's position is compared with these
outlines on the gardener's own device.

## Files

- `regionNames.json`: the regions of New Zealand, Australia, the United
  Kingdom, the United States and Canada, with their codes and the names a
  gardener might type. Always loaded. Small.
- `regions.geo.json`: the outline of each region. Loaded only when a plant
  located by GPS has to be placed. Coordinates are longitude and latitude
  multiplied by 1000.

## Codes

- New Zealand, Australia, the United States and Canada: ISO 3166-2
  (`NZ-OTA`, `AU-QLD`, `US-TX`, `CA-ON`).
- United Kingdom: `GB-SCT`, `GB-WLS`, `GB-NIR`, and the nine English regions
  as `GB-ENG-NE`, `-NW`, `-YH`, `-EM`, `-WM`, `-EE`, `-LN`, `-SE`, `-SW`. A
  plant in any English region is also in `GB-ENG`.
- A plant in New Zealand is also in `NZ-N` (North Island) or `NZ-S` (South
  Island).
- Towns are listed in `src/lib/place.ts`, as `<region code>:<Town>`.

## Source and how the outlines were made

Natural Earth, 1:10m "Admin 1 – States, Provinces" (public domain,
naturalearthdata.com), file `ne_10m_admin_1_states_provinces.geojson`.

1. Keep the five countries, dropping uninhabited outlying islands. United
   Kingdom counties are merged into the twelve regions above. Mexico, Ireland
   and the Isle of Man are kept as unnamed outlines, so that a position there
   is not mistaken for the neighbouring region.
2. `mapshaper five_raw.geojson -dissolve2 code copy-fields=name,country,grp -simplify weighted 6% keep-shapes -filter-islands min-area=40km2 remove-empty -o precision=0.001 five_s.geojson`
3. `python3 scripts/build_places.py five_s.geojson src/data/places`

The outlines are simplified, so they are not exact. `src/lib/placeGeo.ts`
never decides a position that is within 10 km of another region: it asks the
gardener.
