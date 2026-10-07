"""Builds the app's region outlines from Natural Earth (public domain).
Input: five_s.geojson, made by mapshaper from ne_10m_admin_1_states_provinces (see README in App/src/data/places).
Output: regions.geo.json (outlines, loaded only when a GPS position has to be placed) and regionNames.json (names, always loaded)."""
import json, sys, math
src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src))
COUNTRY = {"NZ": "New Zealand", "AU": "Australia", "GB": "United Kingdom", "US": "United States", "CA": "Canada"}
RENAME = {"NZ-GIS": "Gisborne", "NZ-MBH": "Marlborough", "NZ-NSN": "Nelson", "NZ-TAS": "Tasman", "NZ-CIT": "Chatham Islands"}
ALIASES = {
 "NZ-MWT": ["manawatu-wanganui", "manawatu-whanganui", "manawatu whanganui", "manawatu", "whanganui", "wanganui"],
 "NZ-HKB": ["hawkes bay", "hawke's bay"], "NZ-BOP": ["bay of plenty"], "NZ-WGN": ["greater wellington", "wairarapa"],
 "NZ-WTC": ["west coast", "westland"], "NZ-WKO": ["waikato"], "NZ-NTL": ["northland", "far north"], "NZ-STL": ["southland"],
 "NZ-CIT": ["chatham islands", "chathams"],
 "AU-ACT": ["act", "canberra"], "AU-NSW": ["nsw"], "AU-QLD": ["qld"], "AU-VIC": ["vic"], "AU-TAS": ["tas"], "AU-WA": ["wa"], "AU-SA": ["sa"], "AU-NT": ["nt"],
 "US-DC": ["dc", "washington dc", "washington d.c.", "district of columbia"],
 "CA-QC": ["quebec"], "CA-NL": ["newfoundland", "labrador"], "CA-PE": ["pei"], "CA-YT": ["yukon territory"], "CA-NT": ["nwt"],
 "GB-ENG-EE": ["east of england", "east anglia", "east"], "GB-ENG-LN": ["london", "greater london"], "GB-ENG-YH": ["yorkshire", "yorkshire and the humber", "yorkshire and humber"],
 "GB-ENG-NE": ["north east england", "north east"], "GB-ENG-NW": ["north west england", "north west"], "GB-ENG-SE": ["south east england", "south east"],
 "GB-ENG-SW": ["south west england", "south west", "west country"], "GB-ENG-EM": ["east midlands"], "GB-ENG-WM": ["west midlands"],
 "GB-NIR": ["n ireland", "ni"],
}
def rings(geom):
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    for poly in polys:
        for ring in poly: yield ring
regions, names = [], []
for f in d["features"]:
    p = f["properties"]; code = p["code"]
    rs = []
    box = [999, 999, -999, -999]
    for ring in rings(f["geometry"]):
        flat = []
        for x, y in ring:
            flat += [round(x * 1000), round(y * 1000)]
            box = [min(box[0], x), min(box[1], y), max(box[2], x), max(box[3], y)]
        rs.append(flat)
    regions.append({"c": code, "b": [round(v, 3) for v in box], "r": rs})
    if p["country"] == "XX": continue
    cc = p["country"]
    al = set(ALIASES.get(code, []))
    if cc in ("AU", "US", "CA"): al.add(code.split("-")[1].lower())
    name = RENAME.get(code, p["name"])
    al.add(name.lower()); al.add(p["name"].lower())
    entry = {"code": code, "name": name, "country": cc}
    if p.get("grp"): entry["group"] = p["grp"]
    entry["aliases"] = sorted(al)
    names.append(entry)
names.sort(key=lambda e: (e["country"], e["name"]))
json.dump({"source": "Natural Earth 10m admin-1 states and provinces (public domain), simplified", "scale": 1000, "regions": regions}, open(out + "/regions.geo.json", "w"), separators=(",", ":"))
json.dump({"countries": COUNTRY, "regions": names}, open(out + "/regionNames.json", "w"), indent=1, ensure_ascii=False)
print(len(regions), "outlines;", len(names), "named regions")
