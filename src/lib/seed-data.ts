'use client';

import { Firestore, collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * Utility to seed the Firestore database with initial Rumonge content.
 * This moves hardcoded data into the editable database.
 */
export async function seedInitialData(db: Firestore) {
  const now = serverTimestamp();

  // 1. Wonders & Attractions
  const wonders = [
    {
      name: "Amashuha (Mugara Hot Springs)",
      type: "Natural Wonder",
      address: "Zone Mugara, Rumonge",
      description: "Famous natural hot springs located in Mugara zone. These therapeutic thermal waters are a must-visit for relaxation and health, situated beautifully near the lake.",
      latitude: -3.9856,
      longitude: 29.4321,
      createdAt: now,
      updatedAt: now
    },
    {
      name: "Saga Resort Beach",
      type: "Relaxation",
      address: "Saga Shoreline",
      description: "Pristine golden sands meeting the crystal waters of Lake Tanganyika. The premier spot for relaxation in southern Burundi.",
      latitude: -3.9742,
      longitude: 29.4285,
      createdAt: now,
      updatedAt: now
    },
    {
      name: "Tanganyika Fishing Hub",
      type: "Adventure",
      address: "Lake Tanganyika",
      description: "Experience the traditional fishing methods and the legendary biodiversity of the world's longest lake.",
      latitude: -3.9711,
      longitude: 29.4210,
      createdAt: now,
      updatedAt: now
    }
  ];

  // 2. Accommodations
  const hotels = [
    {
      name: "Niyibituronsa Hotel",
      type: "Hotel",
      address: "Rumonge Town Center",
      description: "A central Rumonge landmark known for its traditional hospitality and business-friendly amenities.",
      contactPhone: "+257 22 22 22 22",
      createdAt: now,
      updatedAt: now
    },
    {
      name: "Sunrise Hotel",
      type: "Resort",
      address: "Lakeside Drive",
      description: "Experience breathtaking morning views over Lake Tanganyika in this serene lakeside retreat.",
      contactPhone: "+257 22 33 33 33",
      createdAt: now,
      updatedAt: now
    }
  ];

  // 3. Dining
  const dining = [
    {
      name: "Lake View Restaurant",
      type: "Restaurant",
      address: "Saga Shoreline",
      description: "Famous for its fresh Lake Tanganyika Tilapia, served with local cassava and palm oil-infused greens.",
      specialties: ["Grilled Tilapia", "Ndagala"],
      createdAt: now,
      updatedAt: now
    }
  ];

  // 4. Transport
  const transport = [
    {
      name: "Motorcycle Taxis (Boda-Boda)",
      type: "Taxi Service",
      description: "The fastest way to move within Rumonge. Negotiate fares before departing.",
      fareInformation: "1,000 - 3,000 BIF",
      operatingHours: "24/7",
      createdAt: now,
      updatedAt: now
    }
  ];

  // Execute seeding
  wonders.forEach(w => addDocumentNonBlocking(collection(db, "wonderAttractions"), w));
  hotels.forEach(h => addDocumentNonBlocking(collection(db, "accommodations"), h));
  dining.forEach(d => addDocumentNonBlocking(collection(db, "localCuisineSpots"), d));
  transport.forEach(t => addDocumentNonBlocking(collection(db, "transportationOptions"), t));

  return true;
}
