"use client"

import { useState, useEffect } from "react"
import { getAnalytics, subscribeToBooks, subscribeToUsers } from "@/lib/firebase-admin"

export function useBooks() {
  const [books, setBooks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToBooks((booksData) => {
      setBooks(booksData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { books, loading, error }
}

export function useUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToUsers((usersData) => {
      setUsers(usersData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { users, loading, error }
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()

    // Refresh analytics every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return { analytics, loading, error }
}
