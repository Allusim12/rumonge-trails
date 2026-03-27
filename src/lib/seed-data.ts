
'use client';

import { Firestore, collection, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * Utility to seed the Firestore database with initial Rumonge content.
 */
export async function seedInitialData(db: Firestore) {
  const now = serverTimestamp();

  // 0. Site Content
  await setDoc(doc(db, "site_content", "hero"), {
    title: "Where Heritage Meets",
    titleItalic: "The Great Lake",
    subtitle: "Discover Rumonge: A vibrant commune on the shores of Lake Tanganyika, rich in palm oil traditions, world-class fishing, and untouched natural beauty.",
    badge: "Burundi's Tropical Paradise",
    imageUrl: "https://picsum.photos/seed/rumonge1/1920/1080",
    updatedAt: now,
    createdAt: now
  });

  await setDoc(doc(db, "site_content", "office"), {
    name: "Augustin MINANI",
    title: "Commune Rumonge Office",
    subtitle: "Administrator of Rumonge Commune",
    description: "\"Our mission is to foster a Rumonge that thrives through its traditions while embracing modern opportunities for all our citizens and visitors.\"",
    imageUrl: "https://picsum.photos/seed/admin/400/400",
    updatedAt: now,
    createdAt: now
  });

  // 1. Trending Updates (News)
  const updates = [
    {
      title: "Rumonge Cultural Trails Platform Launches",
      category: "Tourism",
      content: "The official digital gateway to Rumonge is now live, featuring AI itinerary planning and local cultural spotlights.",
      imageUrl: "https://picsum.photos/seed/launch/800/600",
      likedBy: [],
      createdAt: now,
      updatedAt: now
    },
    {
      title: "Sustainable Palm Oil Initiative Expands",
      category: "Development",
      content: "Local cooperatives receive new equipment to enhance traditional palm oil production while preserving the surrounding ecosystem.",
      imageUrl: "https://picsum.photos/seed/palm/800/600",
      likedBy: [],
      createdAt: now,
      updatedAt: now
    }
  ];

  // 2. Wonders & Attractions
  const wonders = [
    {
      name: "Amashuha (Mugara Hot Springs)",
      type: "Natural Wonder",
      address: "Zone Mugara, Rumonge",
      description: "Famous natural hot springs located in Mugara zone. These therapeutic thermal waters are a must-visit for relaxation and health.",
      latitude: -3.9856,
      longitude: 29.4321,
      imageUrl: "https://picsum.photos/seed/hotsprings/800/600",
      rating: 4.9,
      createdAt: now,
      updatedAt: now
    }
  ];

  // Seeding
  updates.forEach(u => addDocumentNonBlocking(collection(db, "trendingUpdates"), u));
  wonders.forEach(w => addDocumentNonBlocking(collection(db, "wonderAttractions"), w));

  return true;
}
