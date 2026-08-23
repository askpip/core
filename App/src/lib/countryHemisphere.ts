/**
 * A static country -> hemisphere lookup, used only when a gardener enters
 * their location manually (typing a country doesn't give us a latitude the
 * way "use my location" does). This is plain geography, not a judgment call —
 * it doesn't need PKR governance the way plant-specific findings do.
 *
 * Deliberately not exhaustive. It covers the countries a gardening app's
 * userbase is realistically concentrated in, not all ~195 UN member states.
 * Matching src/lib/suitabilityGates.ts's standing rule for this whole
 * project: an unrecognized or ambiguous entry resolves to "don't know"
 * (see EQUATOR_STRADDLING and hemisphereFromCountry in location.ts) rather
 * than a guess. Extend this list as real gardeners report countries it's
 * missing — safer to grow it from actual gaps than to hand-author all 195
 * now and get some subtly wrong.
 *
 * Keys are matched case-insensitively after trimming (see location.ts) —
 * store any reasonable spelling here in whatever case reads clearly.
 */
export const NORTHERN_HEMISPHERE_COUNTRIES = [
  'United States', 'USA', 'United States of America', 'Canada',
  'United Kingdom', 'UK', 'England', 'Scotland', 'Wales', 'Northern Ireland',
  'Ireland', 'France', 'Germany', 'Netherlands', 'Belgium', 'Switzerland',
  'Austria', 'Italy', 'Spain', 'Portugal', 'Poland', 'Sweden', 'Norway',
  'Denmark', 'Finland', 'Iceland', 'Greece', 'Turkey', 'Russia',
  'Ukraine', 'Belarus', 'Romania', 'Bulgaria', 'Hungary', 'Czech Republic',
  'Czechia', 'Slovakia', 'Croatia', 'Serbia', 'Bosnia and Herzegovina',
  'Slovenia', 'Albania', 'North Macedonia', 'Estonia', 'Latvia', 'Lithuania',
  'Luxembourg', 'Malta', 'Cyprus',
  'China', 'Japan', 'South Korea', 'North Korea', 'Mongolia', 'Taiwan',
  'India', 'Pakistan', 'Bangladesh', 'Nepal', 'Bhutan', 'Sri Lanka',
  'Afghanistan', 'Iran', 'Iraq', 'Saudi Arabia', 'United Arab Emirates',
  'UAE', 'Israel', 'Palestine', 'Jordan', 'Lebanon', 'Syria', 'Kuwait',
  'Qatar', 'Bahrain', 'Oman', 'Yemen',
  'Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco', 'Sudan',
  'Mexico', 'Guatemala', 'Belize', 'Honduras', 'El Salvador', 'Nicaragua',
  'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic',
  'Puerto Rico', 'Bahamas', 'Trinidad and Tobago',
  'Kazakhstan', 'Uzbekistan', 'Turkmenistan', 'Kyrgyzstan', 'Tajikistan',
  'Thailand', 'Vietnam', 'Laos', 'Cambodia', 'Myanmar', 'Philippines',
]

export const SOUTHERN_HEMISPHERE_COUNTRIES = [
  'Australia', 'New Zealand', 'South Africa', 'Argentina', 'Chile',
  'Uruguay', 'Paraguay', 'Bolivia', 'Peru',
  'Namibia', 'Botswana', 'Zimbabwe', 'Zambia', 'Mozambique', 'Madagascar',
  'Malawi', 'Angola', 'Lesotho', 'Eswatini', 'Swaziland',
  'Fiji', 'Papua New Guinea', 'Vanuatu', 'Samoa', 'Tonga',
  'East Timor', 'Timor-Leste',
]

/**
 * Countries whose territory straddles the equator, where "which hemisphere"
 * isn't a single safe answer from the country name alone. Listed explicitly
 * (rather than just omitted) so it's clear this is a deliberate "don't
 * guess" rather than a country we simply haven't gotten to yet.
 */
export const EQUATOR_STRADDLING_COUNTRIES = [
  'Brazil', 'Indonesia', 'Ecuador', 'Colombia', 'Kenya', 'Uganda',
  'Somalia', 'DR Congo', 'Democratic Republic of the Congo', 'Congo',
  'Republic of the Congo', 'Gabon', 'São Tomé and Príncipe', 'Sao Tome and Principe',
  'Kiribati', 'Maldives',
]
