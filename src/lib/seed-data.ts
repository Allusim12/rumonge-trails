'use client';

import { Firestore, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * Utility to seed the Firestore database with initial Rumonge content.
 * This moves all hardcoded features into the editable database.
 */
export async function seedInitialData(db: Firestore) {
  const now = serverTimestamp();

  // 0. Site Content (Hero)
  const heroContent = {
    title: "Where Heritage Meets",
    titleItalic: "The Great Lake",
    subtitle: "Discover Rumonge: A vibrant commune on the shores of Lake Tanganyika, rich in palm oil traditions, world-class fishing, and untouched natural beauty.",
    badge: "Burundi's Tropical Paradise",
    imageUrl: "https://picsum.photos/seed/rumonge1/1920/1080",
    updatedAt: now,
    createdAt: now
  };
  await setDoc(doc(db, "site_content", "hero"), heroContent);

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
      description: "A central Rumonge landmark known for its traditional hospitality.",
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
      description: "Experience breathtaking morning views over Lake Tanganyika.",
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
      description: "Famous for its fresh Lake Tanganyika Tilapia.",
      specialties: ["Grilled Tilapia"],
      imageUrl: "https://picsum.photos/seed/food/800/600",
      rating: 4.8,
      createdAt: now,
      updatedAt: now
    }
  ];

  // Seeding
  wonders.forEach(w => addDocumentNonBlocking(collection(db, "wonderAttractions"), w));
  heritage.forEach(h => addDocumentNonBlocking(collection(db, "culturalHeritages"), h));
  events.forEach(e => addDocumentNonBlocking(collection(db, "events"), e));
  hotels.forEach(h => addDocumentNonBlocking(collection(db, "accommodations"), h));
  dining.forEach(d => addDocumentNonBlocking(collection(db, "localCuisineSpots"), d));

  return true;
}
