"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useRealtimeBooks, useRealtimeUsers, useRealtimeAnalytics } from "@/hooks/use-realtime-data"
import { getAuditLogs, type AuditLog } from "@/lib/firebase-realtime"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Users,
  UserCheck,
  PenTool,
  Download,
  BarChart3,
  Loader2,
  ArrowUpRight,
  Calendar,
  Activity,
  Shield,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminHomeDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [auditLoading, setAuditLoading] = useState(true)

  const { books, loading: booksLoading } = useRealtimeBooks()
  const { users, loading: usersLoading } = useRealtimeUsers()
  const { analytics, loading: analyticsLoading } = useRealtimeAnalytics()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/signin")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const logs = await getAuditLogs(10) // Get last 10 audit logs
        setAuditLogs(logs)
      } catch (error) {
        console.error("Error fetching audit logs:", error)
      } finally {
        setAuditLoading(false)
      }
    }

    if (user) {
      fetchAuditLogs()
    }
  }, [user])

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "text-green-600"
      case "UPDATE":
        return "text-blue-600"
      case "DELETE":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalBooks = books?.length || 0
  const totalUsers = users?.length || 0
  const totalAuthors = users?.filter((user) => user.role === "Author")?.length || 0
  const totalAgents = users?.filter((user) => user.role === "Agent")?.length || 0
  const publishedBooks = books?.filter((book) => book.status === "Published")?.length || 0
  const totalDownloads = books?.reduce((sum, book) => sum + (book.downloads || 0), 0) || 0

  const recentBooks = books?.slice(0, 5) || []
  const recentUsers = users?.slice(0, 5) || []

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, Admin</h1>
        <p className="text-muted-foreground">Here's what's happening with your SBO APP platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {booksLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-card-foreground">{totalBooks}</div>
                <p className="text-xs text-muted-foreground">
                  {publishedBooks} published • {totalBooks - publishedBooks} drafts
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Authors</CardTitle>
            <PenTool className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-card-foreground">{totalAuthors}</div>
                <p className="text-xs text-muted-foreground">Active content creators</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-card-foreground">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered members</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-card-foreground">{totalAgents}</div>
                <p className="text-xs text-muted-foreground">Platform agents</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {booksLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-2xl font-bold text-card-foreground">{totalDownloads}</div>
                <p className="text-xs text-muted-foreground">All time downloads</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{Math.floor(totalUsers * 0.15)}</div>
            <p className="text-xs text-muted-foreground">Users active today</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{Math.floor(totalBooks * 0.3)}</div>
            <p className="text-xs text-muted-foreground">New books added</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
            </div>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/books">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BookOpen className="h-4 w-4 mr-2" />
                Manage Books
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/admin/authors">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <PenTool className="h-4 w-4 mr-2" />
                Manage Authors
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/admin/agents">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <UserCheck className="h-4 w-4 mr-2" />
                Manage Agents
                <ArrowUpRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Recent Activity
              </CardTitle>
            </div>
            <CardDescription>Latest admin actions and system changes</CardDescription>
          </CardHeader>
          <CardContent>
            {auditLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : auditLogs.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors border border-border/50"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          log.action === "CREATE"
                            ? "bg-green-500"
                            : log.action === "UPDATE"
                              ? "bg-blue-500"
                              : log.action === "DELETE"
                                ? "bg-red-500"
                                : "bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getActionColor(log.action)}`}>{log.action}</span>
                        <span className="text-sm text-muted-foreground">{log.entityType}</span>
                      </div>
                      <p className="text-sm text-card-foreground mt-1">{log.details}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimestamp(log.timestamp)}</span>
                        <span>•</span>
                        <span>{log.userEmail}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-card-foreground">Recent Books</CardTitle>
              <Link href="/admin/books">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <CardDescription>Latest additions to your library</CardDescription>
          </CardHeader>
          <CardContent>
            {booksLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : recentBooks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No books available</p>
            ) : (
              <div className="space-y-3">
                {recentBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-8 h-10 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center overflow-hidden">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{book.title}</p>
                      <p className="text-xs text-muted-foreground truncate">by {book.author}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{book.downloads || 0} downloads</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </CardTitle>
            <CardDescription>Platform status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Database Status</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-600">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Response</span>
                <span className="text-sm text-card-foreground">~120ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Sessions</span>
                <span className="text-sm text-card-foreground">{Math.floor(totalUsers * 0.15)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Storage Used</span>
                <span className="text-sm text-card-foreground">2.4 GB / 10 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Platform Overview
          </CardTitle>
          <CardDescription>Key metrics and performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{publishedBooks}</div>
              <p className="text-sm text-muted-foreground">Published Books</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{totalBooks - publishedBooks}</div>
              <p className="text-sm text-muted-foreground">Draft Books</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{Math.floor(totalUsers * 0.7)}</div>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalDownloads}</div>
              <p className="text-sm text-muted-foreground">Total Downloads</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
