// This script sets up the initial Firestore collections and sample data
// Run this after setting up your Firebase project

const admin = require("firebase-admin")

// Initialize Firebase Admin (you'll need to add your service account key)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
//   projectId: 'your-project-id'
// });

const db = admin.firestore()

async function setupFirestore() {
  try {
    // Create sample books
    const booksRef = db.collection("books")

    const sampleBooks = [
      {
        title: "The Digital Library Revolution",
        author: "Sarah Johnson",
        category: "Technology",
        description: "A comprehensive guide to modern digital libraries and their impact on education.",
        status: "Published",
        downloads: 1250,
        rating: 4.8,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        title: "Modern Web Development",
        author: "Mike Chen",
        category: "Programming",
        description: "Learn the latest techniques in web development with practical examples.",
        status: "Draft",
        downloads: 0,
        rating: 0,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        title: "The Art of Reading",
        author: "Emma Wilson",
        category: "Literature",
        description: "Exploring the deeper meanings and techniques of effective reading.",
        status: "Published",
        downloads: 890,
        rating: 4.6,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
    ]

    for (const book of sampleBooks) {
      await booksRef.add(book)
    }

    console.log("Sample books added successfully!")

    // Set up Firestore security rules (you'll need to add these in the Firebase Console)
    console.log(`
    Add these security rules to your Firestore:
    
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Books collection - read for all, write for authenticated users
        match /books/{bookId} {
          allow read: if true;
          allow write: if request.auth != null;
        }
        
        // Users collection - users can only access their own data
        match /users/{userId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
        
        // Admin access (you can customize this based on your admin logic)
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
    `)
  } catch (error) {
    console.error("Error setting up Firestore:", error)
  }
}

// Uncomment to run the setup
// setupFirestore();

module.exports = { setupFirestore }
