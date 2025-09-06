"use client"

import { useState, useEffect } from "react"
import { subscribeToBooks, subscribeToUsers, subscribeToAnalytics, type Book, type User } from "@/lib/firebase-realtime"

export const useRealtimeBooks = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToBooks((booksData) => {
      setBooks(booksData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { books, loading }
}

export const useRealtimeUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToUsers((usersData) => {
      setUsers(usersData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { users, loading }
}

export const useRealtimeAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAnalytics((analyticsData) => {
      setAnalytics(analyticsData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { analytics, loading }
}
