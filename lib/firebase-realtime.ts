import { db } from "./firebase"
import { ref, get, set, push, update, remove, onValue, off } from "firebase/database"

export interface Book {
  bookId: string
  bookName: string
  bookAuth: string
  bookCat: number
  coverImage: string
  pdfUrl: string
  downloads: number
  likes: number
  isPaid: boolean
  isActive: boolean
}

export interface User {
  uid: string
  email: string
  fullname: string
  roleId: number
  isActive: boolean
  isVerified: boolean
  subscriptions?: string[]
}

export interface Category {
  catId: number
  catName: string
  catBooks: string[]
  isActive: boolean
}

export interface Author {
  authorId: string
  authorName: string
  authorCat: number
  authorBooks: string[]
  uid: string
  isActive: boolean
}

export interface Subscription {
  subsId: number
  subName: string
  price: number
  subDur: string
  unlocksBooks: string[]
  isActive: boolean
}

export interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  userId: string
  userEmail: string
  timestamp: number
  details: string
  oldData?: any
  newData?: any
}

// Books operations
export const getBooks = async (): Promise<Book[]> => {
  const booksRef = ref(db, "SBOAPP/books")
  const snapshot = await get(booksRef)
  if (snapshot.exists()) {
    const booksData = snapshot.val()
    return Object.values(booksData) as Book[]
  }
  return []
}

export const addBook = async (book: Omit<Book, "bookId">): Promise<string> => {
  const booksRef = ref(db, "SBOAPP/books")
  const newBookRef = push(booksRef)
  const bookId = `b${Date.now()}`
  await set(newBookRef, { ...book, bookId })
  return bookId
}

export const updateBook = async (bookId: string, updates: Partial<Book>): Promise<void> => {
  const bookRef = ref(db, `SBOAPP/books/${bookId}`)
  await update(bookRef, updates)
}

export const deleteBook = async (bookId: string): Promise<void> => {
  const bookRef = ref(db, `SBOAPP/books/${bookId}`)
  await remove(bookRef)
}

export const addBookWithAudit = async (
  book: Omit<Book, "bookId">,
  userId: string,
  userEmail: string,
): Promise<string> => {
  const booksRef = ref(db, "SBOAPP/books")
  const newBookRef = push(booksRef)
  const bookId = `b${Date.now()}`
  const newBook = { ...book, bookId }

  await set(newBookRef, newBook)
  await logAuditAction("CREATE", "Book", bookId, userId, userEmail, `Created book: ${book.bookName}`, null, newBook)

  return bookId
}

export const updateBookWithAudit = async (
  bookId: string,
  updates: Partial<Book>,
  userId: string,
  userEmail: string,
): Promise<void> => {
  // Get old data first
  const bookRef = ref(db, `SBOAPP/books/${bookId}`)
  const snapshot = await get(bookRef)
  const oldData = snapshot.exists() ? snapshot.val() : null

  await update(bookRef, updates)
  await logAuditAction(
    "UPDATE",
    "Book",
    bookId,
    userId,
    userEmail,
    `Updated book: ${updates.bookName || bookId}`,
    oldData,
    { ...oldData, ...updates },
  )
}

export const deleteBookWithAudit = async (bookId: string, userId: string, userEmail: string): Promise<void> => {
  // Get data before deletion
  const bookRef = ref(db, `SBOAPP/books/${bookId}`)
  const snapshot = await get(bookRef)
  const oldData = snapshot.exists() ? snapshot.val() : null

  await remove(bookRef)
  await logAuditAction(
    "DELETE",
    "Book",
    bookId,
    userId,
    userEmail,
    `Deleted book: ${oldData?.bookName || bookId}`,
    oldData,
    null,
  )
}

export const addBookToRealtime = async (bookData: {
  title: string
  author: string
  category: string
  description: string
  coverImage: string
  pdfUrl: string
  price: number
  status: "Draft" | "Published"
}): Promise<string> => {
  const booksRef = ref(db, "SBOAPP/books")
  const newBookRef = push(booksRef)
  const bookId = `b${Date.now()}`

  const book: Book = {
    bookId,
    bookName: bookData.title,
    bookAuth: bookData.author,
    bookCat: 1, // Default category ID, can be mapped from category name
    coverImage: bookData.coverImage,
    pdfUrl: bookData.pdfUrl,
    downloads: 0,
    likes: 0,
    isPaid: bookData.price > 0,
    isActive: bookData.status === "Published",
  }

  await set(newBookRef, book)
  return bookId
}

// Users operations
export const getUsers = async (): Promise<User[]> => {
  const usersRef = ref(db, "SBOAPP/users")
  const snapshot = await get(usersRef)
  if (snapshot.exists()) {
    const usersData = snapshot.val()
    return Object.values(usersData) as User[]
  }
  return []
}

export const addUser = async (user: User): Promise<void> => {
  const userRef = ref(db, `SBOAPP/users/user${Date.now()}`)
  await set(userRef, user)
}

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  const userRef = ref(db, `SBOAPP/users/${userId}`)
  await update(userRef, updates)
}

export const deleteUser = async (userId: string): Promise<void> => {
  const userRef = ref(db, `SBOAPP/users/${userId}`)
  await remove(userRef)
}

export const addUserWithAudit = async (user: User, adminUserId: string, adminUserEmail: string): Promise<void> => {
  const userRef = ref(db, `SBOAPP/users/user${Date.now()}`)
  await set(userRef, user)
  await logAuditAction(
    "CREATE",
    "User",
    user.uid,
    adminUserId,
    adminUserEmail,
    `Created user: ${user.fullname}`,
    null,
    user,
  )
}

export const updateUserWithAudit = async (
  userId: string,
  updates: Partial<User>,
  adminUserId: string,
  adminUserEmail: string,
): Promise<void> => {
  // Get old data first
  const userRef = ref(db, `SBOAPP/users/${userId}`)
  const snapshot = await get(userRef)
  const oldData = snapshot.exists() ? snapshot.val() : null

  await update(userRef, updates)
  await logAuditAction(
    "UPDATE",
    "User",
    userId,
    adminUserId,
    adminUserEmail,
    `Updated user: ${updates.fullname || userId}`,
    oldData,
    { ...oldData, ...updates },
  )
}

export const deleteUserWithAudit = async (
  userId: string,
  adminUserId: string,
  adminUserEmail: string,
): Promise<void> => {
  // Get data before deletion
  const userRef = ref(db, `SBOAPP/users/${userId}`)
  const snapshot = await get(userRef)
  const oldData = snapshot.exists() ? snapshot.val() : null

  await remove(userRef)
  await logAuditAction(
    "DELETE",
    "User",
    userId,
    adminUserId,
    adminUserEmail,
    `Deleted user: ${oldData?.fullname || userId}`,
    oldData,
    null,
  )
}

// Categories operations
export const getCategories = async (): Promise<Category[]> => {
  const categoriesRef = ref(db, "SBOAPP/categories")
  const snapshot = await get(categoriesRef)
  if (snapshot.exists()) {
    const categoriesData = snapshot.val()
    return Object.values(categoriesData) as Category[]
  }
  return []
}

// Analytics operations
export const getAnalytics = async () => {
  const analyticsRef = ref(db, "SBOAPP/appManagement/analytics")
  const snapshot = await get(analyticsRef)
  if (snapshot.exists()) {
    return snapshot.val()
  }
  return null
}

// Landing page operations
export const getLandingPageData = async () => {
  const landingRef = ref(db, "SBOAPP/landingPage")
  const snapshot = await get(landingRef)
  if (snapshot.exists()) {
    return snapshot.val()
  }
  return null
}

// Real-time listeners
export const subscribeToBooks = (callback: (books: Book[]) => void) => {
  const booksRef = ref(db, "SBOAPP/books")
  const unsubscribe = onValue(booksRef, (snapshot) => {
    if (snapshot.exists()) {
      const booksData = snapshot.val()
      callback(Object.values(booksData) as Book[])
    } else {
      callback([])
    }
  })
  return () => off(booksRef, "value", unsubscribe)
}

export const subscribeToUsers = (callback: (users: User[]) => void) => {
  const usersRef = ref(db, "SBOAPP/users")
  const unsubscribe = onValue(usersRef, (snapshot) => {
    if (snapshot.exists()) {
      const usersData = snapshot.val()
      callback(Object.values(usersData) as User[])
    } else {
      callback([])
    }
  })
  return () => off(usersRef, "value", unsubscribe)
}

export const subscribeToAnalytics = (callback: (analytics: any) => void) => {
  const analyticsRef = ref(db, "SBOAPP/appManagement/analytics")
  const unsubscribe = onValue(analyticsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val())
    }
  })
  return () => off(analyticsRef, "value", unsubscribe)
}

// Audit logging operations
export const logAuditAction = async (
  action: string,
  entityType: string,
  entityId: string,
  userId: string,
  userEmail: string,
  details: string,
  oldData?: any,
  newData?: any,
): Promise<void> => {
  const auditRef = ref(db, "SBOAPP/auditLogs")
  const newAuditRef = push(auditRef)
  const auditLog: AuditLog = {
    id: `audit_${Date.now()}`,
    action,
    entityType,
    entityId,
    userId,
    userEmail,
    timestamp: Date.now(),
    details,
    oldData,
    newData,
  }
  await set(newAuditRef, auditLog)
}

export const getAuditLogs = async (limit = 50): Promise<AuditLog[]> => {
  const auditRef = ref(db, "SBOAPP/auditLogs")
  const snapshot = await get(auditRef)
  if (snapshot.exists()) {
    const auditData = snapshot.val()
    const logs = Object.values(auditData) as AuditLog[]
    return logs.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
  }
  return []
}

export const subscribeToAuditLogs = (callback: (logs: AuditLog[]) => void, limit = 50) => {
  const auditRef = ref(db, "SBOAPP/auditLogs")
  const unsubscribe = onValue(auditRef, (snapshot) => {
    if (snapshot.exists()) {
      const auditData = snapshot.val()
      const logs = Object.values(auditData) as AuditLog[]
      const sortedLogs = logs.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit)
      callback(sortedLogs)
    } else {
      callback([])
    }
  })
  return () => off(auditRef, "value", unsubscribe)
}

// Auth-specific logging
export const logSignInAction = async (userId: string, userEmail: string): Promise<void> => {
  await logAuditAction("SIGN_IN", "Auth", userId, userId, userEmail, `User signed in: ${userEmail}`, null, {
    timestamp: Date.now(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "Server",
  })
}

export const logSignUpAction = async (userId: string, userEmail: string): Promise<void> => {
  await logAuditAction("SIGN_UP", "Auth", userId, userId, userEmail, `New user registered: ${userEmail}`, null, {
    timestamp: Date.now(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "Server",
  })
}

export const logSignOutAction = async (userId: string, userEmail: string): Promise<void> => {
  await logAuditAction("SIGN_OUT", "Auth", userId, userId, userEmail, `User signed out: ${userEmail}`, null, {
    timestamp: Date.now(),
  })
}

// Page view tracking
export const logPageView = async (userId: string, userEmail: string, page: string): Promise<void> => {
  await logAuditAction(
    "PAGE_VIEW",
    "Navigation",
    `page_${Date.now()}`,
    userId,
    userEmail,
    `User viewed page: ${page}`,
    null,
    { page, timestamp: Date.now(), userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "Server" },
  )
}
