import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore"
import { db } from "./firebase"

// Book management functions
export const addBook = async (bookData: {
  title: string
  author: string
  category: string
  description?: string
  status: "Draft" | "Published"
}) => {
  try {
    const docRef = await addDoc(collection(db, "books"), {
      ...bookData,
      downloads: 0,
      rating: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding book:", error)
    throw error
  }
}

export const getBooks = async () => {
  try {
    const q = query(collection(db, "books"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting books:", error)
    throw error
  }
}

export const updateBook = async (bookId: string, updates: any) => {
  try {
    const bookRef = doc(db, "books", bookId)
    await updateDoc(bookRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating book:", error)
    throw error
  }
}

export const deleteBook = async (bookId: string) => {
  try {
    await deleteDoc(doc(db, "books", bookId))
  } catch (error) {
    console.error("Error deleting book:", error)
    throw error
  }
}

// User management functions
export const getUsers = async () => {
  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error("Error getting users:", error)
    throw error
  }
}

export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Analytics functions
export const getAnalytics = async () => {
  try {
    const [booksSnapshot, usersSnapshot] = await Promise.all([
      getDocs(collection(db, "books")),
      getDocs(collection(db, "users")),
    ])

    const books = booksSnapshot.docs.map((doc) => doc.data())
    const users = usersSnapshot.docs.map((doc) => doc.data())

    const totalDownloads = books.reduce((sum, book) => sum + (book.downloads || 0), 0)
    const publishedBooks = books.filter((book) => book.status === "Published").length
    const activeUsers = users.filter((user) => user.status === "Active").length

    // Category breakdown
    const categoryStats = books.reduce(
      (acc, book) => {
        const category = book.category || "Other"
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalBooks: books.length,
      publishedBooks,
      totalUsers: users.length,
      activeUsers,
      totalDownloads,
      categoryStats,
    }
  } catch (error) {
    console.error("Error getting analytics:", error)
    throw error
  }
}

// Real-time listeners
export const subscribeToBooks = (callback: (books: any[]) => void) => {
  const q = query(collection(db, "books"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (querySnapshot) => {
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(books)
  })
}

export const subscribeToUsers = (callback: (users: any[]) => void) => {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"))
  return onSnapshot(q, (querySnapshot) => {
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(users)
  })
}
