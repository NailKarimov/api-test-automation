/** Reference locations used across tests. Coordinates are rounded city centres. */
export const LOCATIONS = {
  riga: { name: 'Riga', country: 'LV', lat: 56.9496, lon: 24.1052 },
  reykjavik: { name: 'Reykjavik', country: 'IS', lat: 64.1466, lon: -21.9426 },
  sydney: { name: 'Sydney', country: 'AU', lat: -33.8688, lon: 151.2093 },
} as const;

/** Coordinate boundary values for boundary value analysis (lat ±90, lon ±180). */
export const VALID_COORDS = [
  { case: 'north pole lat=90', lat: 90, lon: 0 },
  { case: 'south pole lat=-90', lat: -90, lon: 0 },
  { case: 'antimeridian lon=180', lat: 0, lon: 180 },
  { case: 'antimeridian lon=-180', lat: 0, lon: -180 },
  { case: 'null island 0,0', lat: 0, lon: 0 },
];

export const INVALID_COORDS = [
  { case: 'lat just above 90', lat: 90.01, lon: 0 },
  { case: 'lat just below -90', lat: -90.01, lon: 0 },
  { case: 'lon just above 180', lat: 0, lon: 180.01 },
  { case: 'lon just below -180', lat: 0, lon: -180.01 },
  { case: 'non-numeric lat', lat: 'abc', lon: 0 },
];
