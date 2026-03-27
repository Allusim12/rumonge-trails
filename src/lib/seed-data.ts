
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
    },
    {
      name: "Saga Resort Beach",
      type: "Beach",
      address: "Saga Shoreline",
      description: "Pristine golden sands meeting the crystal waters of Lake Tanganyika.",
      latitude: -3.9735,
      longitude: 29.4384,
      imageUrl: "https://picsum.photos/seed/beach/800/600",
      rating: 4.9,
      createdAt: now,
      updatedAt: now
    }
  ];

  // 3. Stays
  const stays = [
    {
      name: "Niyibituronsa Hotel",
      type: "Hotel",
      address: "Rumonge Town Center",
      description: "A central Rumonge landmark known for its traditional hospitality and business-friendly amenities.",
      price: "$$$",
      rating: 4.5,
      imageUrl: "https://picsum.photos/seed/hotel1/800/600",
      createdAt: now,
      updatedAt: now
    },
    {
      name: "Sunrise Hotel",
      type: "Resort",
      address: "Lakeside Drive",
      description: "Experience breathtaking morning views over Lake Tanganyika in this serene lakeside retreat.",
      price: "$$$$",
      rating: 4.8,
      imageUrl: "https://picsum.photos/seed/hotel2/800/600",
      createdAt: now,
      updatedAt: now
    }
  ];

  // 4. Media Assets
  const media = [
    { url: "https://picsum.photos/seed/rumonge1/800/600", caption: "Lush Coastlines", mediaType: "nature", uploadedAt: now },
    { url: "https://picsum.photos/seed/drums/800/600", caption: "Rhythms of Ancestors", mediaType: "culture", uploadedAt: now },
    { url: "https://picsum.photos/seed/food/800/600", caption: "Traditional Flavors", mediaType: "food", uploadedAt: now }
  ];

  // Seeding
  updates.forEach(u => addDocumentNonBlocking(collection(db, "trendingUpdates"), u));
  wonders.forEach(w => addDocumentNonBlocking(collection(db, "wonderAttractions"), w));
  stays.forEach(s => addDocumentNonBlocking(collection(db, "accommodations"), s));
  media.forEach(m => addDocumentNonBlocking(collection(db, "mediaAssets"), m));

  return true;
}
