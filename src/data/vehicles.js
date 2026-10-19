export const VEHICLES = [
  {
    id: 'bz4x',
    name: 'bZ4X',
    fullName: 'Toyota bZ4X',
    type: 'Battery EV (BEV)',
    badge: '100% Electric',
    image: '/vehicles/bz4x.jpg',
    color: '#00F0FF',
    accentText: 'Beyond Zero'
  },
  {
    id: 'rav4',
    name: 'RAV4 Hybrid',
    fullName: 'Toyota RAV4 HEV',
    type: 'Hybrid EV (HEV)',
    badge: 'e-Four AWD',
    image: '/vehicles/rav4.jpg',
    color: '#3B82F6',
    accentText: 'Electrified SUV'
  },
  {
    id: 'camry',
    name: 'Camry Hybrid',
    fullName: 'Toyota Camry HEV',
    type: 'Hybrid EV (HEV)',
    badge: 'Executive HEV',
    image: '/vehicles/camry.jpg',
    color: '#94A3B8',
    accentText: 'Luxury Sedan'
  },
  {
    id: 'corolla_cross',
    name: 'Corolla Cross',
    fullName: 'Toyota Corolla Cross HEV',
    type: 'Hybrid EV (HEV)',
    badge: 'Urban Crossover',
    image: '/vehicles/corolla_cross.jpg',
    color: '#38BDF8',
    accentText: 'Smart Mobility'
  },
  {
    id: 'prius',
    name: 'Prius Hybrid',
    fullName: 'Toyota Prius HEV',
    type: 'Hybrid EV (HEV)',
    badge: 'Aero Efficiency',
    image: '/vehicles/prius.jpg',
    color: '#EAB308',
    accentText: 'Hybrid Pioneer'
  },
  {
    id: 'yaris_cross',
    name: 'Yaris Cross',
    fullName: 'Toyota Yaris Cross HEV',
    type: 'Hybrid EV (HEV)',
    badge: 'Compact HEV',
    image: '/vehicles/yaris_cross.jpg',
    color: '#EF4444',
    accentText: 'Urban Agility'
  },
  {
    id: 'zenix',
    name: 'Innova Zenix',
    fullName: 'Toyota Innova Zenix HEV',
    type: 'Hybrid EV (HEV)',
    badge: '7-Seater Premium',
    image: '/vehicles/zenix.jpg',
    color: '#64748B',
    accentText: 'Family EV Tech'
  },
  {
    id: 'ravx',
    name: 'RAV-X Concept',
    fullName: 'Toyota RAV-X EV Concept',
    type: 'Concept EV (PHEV)',
    badge: 'Rally EV Concept',
    image: '/vehicles/ravx.jpg',
    color: '#F97316',
    accentText: 'Future Off-Road'
  }
];

// Helper to generate the 16 grid cards (8 pairs of identical vehicle photos)
export function generateGameGrid(vehicleList = VEHICLES) {
  const cards = [];

  // Randomly select eight distinct vehicles for the 4x4 (16-tile) grid.
  // This keeps the game ready for a larger client-provided vehicle catalogue.
  const shuffledVehicles = [...vehicleList];
  for (let i = shuffledVehicles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledVehicles[i], shuffledVehicles[j]] = [shuffledVehicles[j], shuffledVehicles[i]];
  }
  const selectedVehicles = shuffledVehicles.slice(0, 8);

  selectedVehicles.forEach((vehicle, index) => {
    // Card A: Photo Card
    cards.push({
      cardId: `${vehicle.id}-photo`,
      vehicleId: vehicle.id,
      cardType: 'photo',
      title: vehicle.name,
      subtitle: vehicle.type,
      image: vehicle.image,
      badge: vehicle.badge,
      color: vehicle.color
    });

    // Card B: Matching photo card
    cards.push({
      cardId: `${vehicle.id}-photo-pair`,
      vehicleId: vehicle.id,
      cardType: 'photo',
      title: vehicle.name,
      subtitle: vehicle.type,
      image: vehicle.image,
      badge: vehicle.badge,
      color: vehicle.color
    });
  });

  const countAdjacentPairs = (cardLayout) => {
    const firstCardIndexByVehicle = new Map();
    let adjacentPairs = 0;

    cardLayout.forEach((card, index) => {
      const firstIndex = firstCardIndexByVehicle.get(card.vehicleId);
      if (firstIndex === undefined) {
        firstCardIndexByVehicle.set(card.vehicleId, index);
        return;
      }

      const rowDistance = Math.abs(Math.floor(firstIndex / 4) - Math.floor(index / 4));
      const columnDistance = Math.abs((firstIndex % 4) - (index % 4));
      if (rowDistance + columnDistance === 1) adjacentPairs += 1;
    });

    return adjacentPairs;
  };

  // Try several random arrangements and retain the one with the fewest
  // side-by-side pairs. A zero-adjacent arrangement is normally found quickly.
  let bestLayout = cards;
  let fewestAdjacentPairs = Infinity;

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const candidate = [...cards];
    for (let i = candidate.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidate[i], candidate[j]] = [candidate[j], candidate[i]];
    }

    const adjacentPairs = countAdjacentPairs(candidate);
    if (adjacentPairs < fewestAdjacentPairs) {
      bestLayout = candidate;
      fewestAdjacentPairs = adjacentPairs;
    }
    if (adjacentPairs === 0) break;
  }

  return bestLayout;
}
