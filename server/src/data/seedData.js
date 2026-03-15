export const rideTypes = [
  { id: "economy", name: "Economy", multiplier: 1, eta: 4, description: "Affordable city rides" },
  { id: "priority", name: "Priority", multiplier: 1.18, eta: 3, description: "Faster pickup during rush" },
  { id: "xl", name: "XL", multiplier: 1.45, eta: 6, description: "Larger rides for groups" },
  { id: "green", name: "Green", multiplier: 1.12, eta: 5, description: "Lower-emission travel" }
];

export const locationSeeds = [
  { name: "Parul University", x: 20, y: 72, order: 1 },
  { name: "Vadodara Junction", x: 76, y: 28, order: 2 },
  { name: "Akshar Chowk", x: 58, y: 48, order: 3 },
  { name: "Sayaji Garden", x: 67, y: 34, order: 4 },
  { name: "Nizampura", x: 63, y: 23, order: 5 },
  { name: "Alkapuri", x: 71, y: 40, order: 6 },
  { name: "Airport Road", x: 84, y: 18, order: 7 },
  { name: "ISKCON Circle", x: 47, y: 54, order: 8 }
];

export const driverSeeds = [
  { name: "Aarav Patel", vehicle: "Maruti Dzire", plate: "GJ06 AX 2184", rating: 4.9, eta: 3, rideType: "priority", status: "available" },
  { name: "Diya Shah", vehicle: "Hyundai Aura", plate: "GJ06 KL 9281", rating: 4.8, eta: 4, rideType: "economy", status: "available" },
  { name: "Harsh Mehta", vehicle: "Toyota Innova", plate: "GJ06 NB 3110", rating: 4.7, eta: 6, rideType: "xl", status: "available" },
  { name: "Nisha Rana", vehicle: "Tata Tigor EV", plate: "GJ06 GT 4421", rating: 4.9, eta: 5, rideType: "green", status: "available" }
];
