export const NAMES = [
  'Liam', 'Sarah', 'Yuki', 'Aisha', 'Carlos', 'John', 'Mike',
  'Emma', 'Sofia', 'Noah', 'Priya', 'Fatima', 'Diego', 'Wei', 'Chloe', 'Ravi'
];

export const CITIES = [
  'Dublin', 'Sydney', 'Tokyo', 'Dubai', 'Mexico City', 'Toronto',
  'Chicago', 'Cape Town', 'Madrid', 'Lagos', 'Mumbai', 'Cairo', 'Buenos Aires', 'Singapore'
];

export const LANDMARKS = [
  { name: 'Pyramids of Giza', city: 'Cairo', country: 'Egypt', object: 'pyramid survey beam' },
  { name: 'Eiffel Tower', city: 'Paris', country: 'France', object: 'iron truss frame' },
  { name: 'Golden Gate Bridge', city: 'San Francisco', country: 'USA', object: 'suspension cable harness' },
  { name: 'Sydney Opera House', city: 'Sydney', country: 'Australia', object: 'crossing roof sail' },
  { name: 'Tokyo Shibuya Crossing', city: 'Tokyo', country: 'Japan', object: 'traffic junction grid' },
  { name: 'Taj Mahal Gardens', city: 'Agra', country: 'India', object: 'symmetry pathway lattice' },
  { name: 'Leaning Tower of Pisa', city: 'Pisa', country: 'Italy', object: 'tilt counterweight support' },
  { name: 'Christ the Redeemer', city: 'Rio de Janeiro', country: 'Brazil', object: 'mountain summit truss' },
  { name: 'Great Wall Watchtowers', city: 'Beijing', country: 'China', object: 'stone watchtower arch' },
  { name: 'Burj Khalifa Summit', city: 'Dubai', country: 'UAE', object: 'spire structural brace' },
];

export const OBJECTS = [
  'bridge cable', 'roof truss', 'solar panel mount', 'crane arm',
  'kite frame', 'skate ramp', 'antenna support', 'clock hand assembly'
];

export function pickContext(rng, ctx) {
  const name = NAMES[(ctx?.slot ?? 0) % NAMES.length];
  const lm = LANDMARKS[(ctx?.world ?? 0) % LANDMARKS.length];
  const object = OBJECTS[(ctx?.slot ?? 0) % OBJECTS.length];
  return {
    name,
    city: lm.city,
    country: lm.country,
    landmark: lm.name,
    object,
  };
}
