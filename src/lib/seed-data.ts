'use client';

import { Firestore, collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * Utility to seed the Firestore database with initial Rumonge content.
 * This moves all hardcoded features into the editable database.
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
      imageUrl: "https://picsum.photos/seed/hotsprings/800/600",
      rating: 4.9,
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
      imageUrl: "https://picsum.photos/seed/sagabeach/800/600",
      rating: 4.9,
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
      imageUrl: "https://picsum.photos/seed/fishing/800/600",
      rating: 4.8,
      createdAt: now,
      updatedAt: now
    }
  ];

  // 2. Cultural Heritage
  const heritage = [
    {
      name: "Traditional Dance & Drumming",
      type: "Art Form",
      description: "The heartbeat of Rumonge, where local troops perform the vibrant dances of the lakeside people.",
      history: "A tradition passed down through generations of Lake Tanganyika fishing communities.",
      imageUrl: "https://picsum.photos/seed/drums/800/600",
      createdAt: now,
      updatedAt: now
    },
    {
      name: "Artisanal Basketry",
      type: "Local Craft",
      description: "Intricate weaving techniques passed down through generations, creating functional and artistic pieces.",
      history: "Using local papyrus and palm fibers, these crafts represent Rumonge's sustainable heritage.",
      imageUrl: "https://picsum.photos/seed/craft/800/600",
      createdAt: now,
      updatedAt: now
    }
  ];

  // 3. Events
  const events = [
    {
      name: "Tanganyika Harvest Festival",
      eventType: "Festival",
      description: "Traditional boat races and communal feasts celebrating the lake's bounty.",
      locationName: "Saga Shoreline",
      startDate: "2024-07-15T10:00:00Z",
      endDate: "2024-07-15T22:00:00Z",
      latitude: -3.97,
      longitude: 29.42,
      imageUrl: "https://picsum.photos/seed/harvest/800/600",
      createdAt: now,
      updatedAt: now
    }
  ];

  // 4. Accommodations
  const hotels = [
    {
      name: "Niyibituronsa Hotel",
      type: "Hotel",
      address: "Rumonge Town Center",
      description: "A central Rumonge landmark known for its traditional hospitality and business-friendly amenities.",
      contactPhone: "+257 22 22 22 22",
      imageUrl: "https://picsum.photos/seed/hotel1/800/600",
      price: "$$$",
      rating: 4.5,
      createdAt: now,
      updatedAt: now
    },
    {
      name: "Sunrise Hotel",
      type: "Resort",
      address: "Lakeside Drive",
      description: "Experience breathtaking morning views over Lake Tanganyika in this serene lakeside retreat.",
      contactPhone: "+257 22 33 33 33",
      imageUrl: "https://picsum.photos/seed/hotel2/800/600",
      price: "$$$$",
      rating: 4.8,
      createdAt: now,
      updatedAt: now
    }
  ];

  // 5. Dining
  const dining = [
    {
      name: "Lake View Restaurant",
      type: "Restaurant",
      address: "Saga Shoreline",
      description: "Famous for its fresh Lake Tanganyika Tilapia, served with local cassava and palm oil-infused greens.",
      specialties: ["Grilled Tilapia", "Ndagala"],
      imageUrl: "https://picsum.photos/seed/food/800/600",
      rating: 4.8,
      createdAt: now,
      updatedAt: now
    }
  ];

  // 6. Transport
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

  // 7. Travel Tips
  const tips = [
    {
      title: "Currency & Payments",
      category: "Money & Banking",
      content: "Burundian Franc (BIF) is primary. Carry cash for local markets; cards are rarely accepted except in large hotels.",
      lastUpdatedAt: new Date().toISOString(),
      createdAt: now,
      updatedAt: now
    }
  ];

  // Execute seeding for all collections
  wonders.forEach(w => addDocumentNonBlocking(collection(db, "wonderAttractions"), w));
  heritage.forEach(h => addDocumentNonBlocking(collection(db, "culturalHeritages"), h));
  events.forEach(e => addDocumentNonBlocking(collection(db, "events"), e));
  hotels.forEach(h => addDocumentNonBlocking(collection(db, "accommodations"), h));
  dining.forEach(d => addDocumentNonBlocking(collection(db, "localCuisineSpots"), d));
  transport.forEach(t => addDocumentNonBlocking(collection(db, "transportationOptions"), t));
  tips.forEach(tip => addDocumentNonBlocking(collection(db, "travelTips"), tip));

  return true;
}
