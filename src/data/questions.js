export const QUESTIONS = [
  { id: 1, category: 'Toyota Lineup & Multi-Pathway', statement: "Toyota's Electric Vehicles (EVs) require plugging into a power outlet to charge all the time.", answer: 'MYTH', explanation: "Toyota's EVs (like the Corolla Cross HEV and bZ4X) are self-charging. They regenerate power while driving and braking." },
  { id: 2, category: 'Toyota Lineup & Multi-Pathway', statement: 'The Toyota bZ4X is Toyota’s first fully electric Battery Electric Vehicle (BEV) introduced in the Philippines.', answer: 'TRUTH', explanation: 'Built on Toyota’s dedicated e-TNGA electric platform, the bZ4X delivers zero-emissions driving with all-wheel-drive capability.' },
  { id: 3, category: 'Toyota Lineup & Multi-Pathway', statement: 'The Toyota Urban Cruiser EV can travel up to 475 km on a single full charge.', answer: 'TRUTH', explanation: 'The Urban Cruiser BEV may offer more than 475 km of range depending on driving conditions.' },
  { id: 4, category: 'Toyota Lineup & Multi-Pathway', statement: 'Toyota hybrid vehicles cannot run on electricity alone under any circumstances.', answer: 'MYTH', explanation: 'Toyota HEVs feature an EV Mode that allows low-speed, pure electric driving over short distances.' },
  { id: 5, category: 'Toyota Lineup & Multi-Pathway', statement: 'Toyota and Lexus offer the widest electrified vehicle line-up and pioneered electrification in the Philippines.', answer: 'TRUTH', explanation: 'Toyota and Lexus have 22 offerings across crossovers, MPVs, sedans, and luxury vehicles. Toyota introduced the first HEV in the Philippines in 2009.' },
  { id: 6, category: 'Driving Experience & PH Conditions', statement: 'Driving an EV (HEV & BEV) through floodwaters is more dangerous than driving a regular gas car.', answer: 'MYTH', explanation: 'Toyota EVs feature waterproof sealed battery casings and automatic high-voltage cut-offs designed to pass strict safety and water-wading tests.' },
  { id: 7, category: 'Driving Experience & PH Conditions', statement: 'Turning on the air conditioner in a Toyota EV rapidly drains the battery and shuts down the car.', answer: 'MYTH', explanation: 'Toyota EVs use an electric climate control compressor that runs off the battery independently, keeping the cabin cool even in traffic.' },
  { id: 8, category: 'Driving Experience & PH Conditions', statement: 'Toyota EVs (HEV & BEV) generate energy every time you apply the brakes.', answer: 'TRUTH', explanation: 'Through regenerative braking, the electric motor acts as a generator when slowing down, converting kinetic energy back into electricity stored in the battery.' },
  { id: 9, category: 'Maintenance, Longevity & Charging', statement: 'Toyota Battery Electric Vehicles are expensive to maintain.', answer: 'MYTH', explanation: 'Toyota Electric Vehicles have lower maintenance requirements, with no motor oil changes and fewer moving parts.' },
  { id: 10, category: 'Maintenance, Longevity & Charging', statement: 'Toyota provides an 8-year or 200,000 km battery warranty for its electrified vehicles in the Philippines.', answer: 'TRUTH', explanation: 'Toyota backs its hybrid and electric batteries with up to an 8-year warranty for peace of mind.' },
  { id: 11, category: 'Maintenance, Longevity & Charging', statement: 'Toyota HEVs require special premium fuel that is different from regular gasoline.', answer: 'MYTH', explanation: 'Toyota HEVs run on standard unleaded commercial gasoline. No special fuels are required.' },
  { id: 12, category: 'Maintenance, Longevity & Charging', statement: 'Fast chargers (DC) can charge a Toyota BEV battery up to 80% in around 30 to 60 minutes.', answer: 'TRUTH', explanation: 'Toyota BEVs can be charged with commercial DC fast charging stations. Toyota offers 19 charging stations nationwide.' },
  { id: 13, category: 'Maintenance, Longevity & Charging', statement: 'Maintaining a Toyota Hybrid Electric Vehicle costs twice as much as maintaining a traditional gas car.', answer: 'MYTH', explanation: 'HEV basic maintenance schedules are virtually identical to regular gas cars.' },
  { id: 14, category: 'Maintenance, Longevity & Charging', statement: 'Battery Electric Vehicles require oil changes every 5,000 kilometers just like gas engines.', answer: 'MYTH', explanation: 'Battery electric vehicles like the bZ4X, Urban Cruiser, and Hilux BEV do not have internal combustion engines, meaning no engine oil changes.' }
];

export const shuffleQuestions = (questions = QUESTIONS, avoidFirstQuestionId = null) => {
  const result = [...questions];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  // A new round should not begin with the question that was just answered.
  if (avoidFirstQuestionId !== null && result.length > 1 && result[0].id === avoidFirstQuestionId) {
    const replacementIndex = result.findIndex((question) => question.id !== avoidFirstQuestionId);
    [result[0], result[replacementIndex]] = [result[replacementIndex], result[0]];
  }

  return result;
};
