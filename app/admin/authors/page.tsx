"use client"

import { useState } from "react"
import { useRealtimeUsers, useRealtimeBooks } from "@/hooks/use-realtime-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  PenTool,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  BookOpen,
  Star,
  TrendingUp,
  Award,
} from "lucide-react"

interface Author {
  id: string
  email: string
  name?: string
  displayName?: string
  role?: string
  status?: string
  subscription?: string
  booksRead?: number
  joinDate?: string
  lastActive?: string
  authorLevel?: string
  genre?: string
  totalBooks?: number
  totalSales?: number
  rating?: number
  bio?: string
}

export default function AuthorsManagementPage() {
  const { users, loading: usersLoading } = useRealtimeUsers()
  const { books, loading: booksLoading } = useRealtimeBooks()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
  const [showAddAuthor, setShowAddAuthor] = useState(false)
  const [showViewAuthor, setShowViewAuthor] = useState(false)
  const [showEditAuthor, setShowEditAuthor] = useState(false)
  const [newAuthor, setNewAuthor] = useState({
    email: "",
    name: "",
    status: "Active",
    authorLevel: "Emerging",
    genre: "",
    bio: "",
  })

  const itemsPerPage = 10

  // Filter authors (users with Author role)
  const authors = users?.filter((user) => user.role === "Author") || []

  // Enhance authors with book data
  const enhancedAuthors = authors.map((author) => {
    const authorBooks = books?.filter((book) => book.author === author.name || book.author === author.displayName) || []
    const totalBooks = authorBooks.length
    const totalDownloads = authorBooks.reduce((sum, book) => sum + (book.downloads || 0), 0)
    const totalLikes = authorBooks.reduce((sum, book) => sum + (book.likes || 0), 0)
    const avgRating = totalLikes > 0 ? (totalLikes / totalBooks).toFixed(1) : "0"

    return {
      ...author,
      totalBooks,
      totalDownloads,
      totalLikes,
      rating: Number.parseFloat(avgRating),
    }
  })

  const filteredAuthors = enhancedAuthors.filter((author: Author) => {
    const matchesSearch =
      author.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.genre?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || author.status === filterStatus
    const matchesLevel = filterLevel === "all" || author.authorLevel === filterLevel

    return matchesSearch && matchesStatus && matchesLevel
  })

  // Pagination
  const totalPages = Math.ceil(filteredAuthors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAuthors = filteredAuthors.slice(startIndex, startIndex + itemsPerPage)

  const handleAddAuthor = () => {
    // Add author logic here
    console.log("Adding author:", newAuthor)
    setShowAddAuthor(false)
    setNewAuthor({ email: "", name: "", status: "Active", authorLevel: "Emerging", genre: "", bio: "" })
  }

  const handleEditAuthor = () => {
    // Edit author logic here
    console.log("Editing author:", selectedAuthor)
    setShowEditAuthor(false)
  }

  const handleDeleteAuthor = (authorId: string) => {
    // Delete author logic here
    console.log("Deleting author:", authorId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Bestseller":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Established":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Rising":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Emerging":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const activeAuthors = authors.filter((author) => author.status === "Active").length
  const totalBooksPublished = enhancedAuthors.reduce((sum, author) => sum + (author.totalBooks || 0), 0)
  const totalDownloads = enhancedAuthors.reduce((sum, author) => sum + (author.totalDownloads || 0), 0)
  const avgRating =
    enhancedAuthors.length > 0
      ? (enhancedAuthors.reduce((sum, author) => sum + (author.rating || 0), 0) / enhancedAuthors.length).toFixed(1)
      : "0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <PenTool className="h-8 w-8 text-primary" />
            Authors Management
          </h1>
          <p className="text-muted-foreground">Manage content creators and their publications</p>
        </div>
        <Dialog open={showAddAuthor} onOpenChange={setShowAddAuthor}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Author
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Author</DialogTitle>
              <DialogDescription>Create a new author account for the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAuthor.email}
                  onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
                  placeholder="author@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authorLevel">Author Level</Label>
                  <Select
                    value={newAuthor.authorLevel}
                    onValueChange={(value) => setNewAuthor({ ...newAuthor, authorLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emerging">Emerging</SelectItem>
                      <SelectItem value="Rising">Rising</SelectItem>
                      <SelectItem value="Established">Established</SelectItem>
                      <SelectItem value="Bestseller">Bestseller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAuthor.status}
                    onValueChange={(value) => setNewAuthor({ ...newAuthor, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Primary Genre</Label>
                <Input
                  id="genre"
                  value={newAuthor.genre}
                  onChange={(e) => setNewAuthor({ ...newAuthor, genre: e.target.value })}
                  placeholder="Fiction, Non-fiction, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={newAuthor.bio}
                  onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
                  placeholder="Brief author biography..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAuthor} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Author
                </Button>
                <Button variant="outline" onClick={() => setShowAddAuthor(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Authors</p>
                <p className="text-2xl font-bold text-foreground">{authors.length}</p>
              </div>
              <PenTool className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Authors</p>
                <p className="text-2xl font-bold text-foreground">{activeAuthors}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Books Published</p>
                <p className="text-2xl font-bold text-foreground">{totalBooksPublished}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold text-foreground">{avgRating}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search authors by name, email, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Emerging">Emerging</SelectItem>
                <SelectItem value="Rising">Rising</SelectItem>
                <SelectItem value="Established">Established</SelectItem>
                <SelectItem value="Bestseller">Bestseller</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Authors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Authors ({filteredAuthors.length})</CardTitle>
          <CardDescription>Manage author accounts and their publications</CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading || booksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading authors...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Author</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Books</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAuthors.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {(author.name || author.displayName || author.email)?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {author.name || author.displayName || "Anonymous"}
                            </p>
                            <p className="text-sm text-muted-foreground">{author.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(author.authorLevel || "Emerging")}>
                          {author.authorLevel || "Emerging"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(author.status || "Active")}>{author.status || "Active"}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground">{author.genre || "Not specified"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{author.totalBooks || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{(author.totalDownloads || 0).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-foreground">{author.rating || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog
                            open={showViewAuthor && selectedAuthor?.id === author.id}
                            onOpenChange={(open) => {
                              setShowViewAuthor(open)
                              if (!open) setSelectedAuthor(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedAuthor(author)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Author Details</DialogTitle>
                                <DialogDescription>View author information and performance</DialogDescription>
                              </DialogHeader>
                              {selectedAuthor && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <p className="text-foreground">
                                        {selectedAuthor.name || selectedAuthor.displayName || "Not provided"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-foreground">{selectedAuthor.email}</p>
                                    </div>
                                    <div>
                                      <Label>Author Level</Label>
                                      <Badge className={getLevelColor(selectedAuthor.authorLevel || "Emerging")}>
                                        {selectedAuthor.authorLevel || "Emerging"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <Badge className={getStatusColor(selectedAuthor.status || "Active")}>
                                        {selectedAuthor.status || "Active"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Primary Genre</Label>
                                      <p className="text-foreground">{selectedAuthor.genre || "Not specified"}</p>
                                    </div>
                                    <div>
                                      <Label>Rating</Label>
                                      <div className="flex items-center space-x-1">
                                        <Star className="h-4 w-4 text-yellow-500" />
                                        <span className="text-foreground">{selectedAuthor.rating || 0}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-primary">
                                        {selectedAuthor.totalBooks || 0}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Books Published</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-primary">
                                        {(selectedAuthor.totalDownloads || 0).toLocaleString()}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Total Downloads</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-primary">
                                        {selectedAuthor.totalLikes || 0}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Total Likes</p>
                                    </div>
                                  </div>

                                  {selectedAuthor.bio && (
                                    <div>
                                      <Label>Biography</Label>
                                      <p className="text-foreground text-sm mt-1">{selectedAuthor.bio}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAuthor(author)
                              setShowEditAuthor(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAuthor(author.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAuthors.length)} of{" "}
                    {filteredAuthors.length} authors
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Author Dialog */}
      <Dialog open={showEditAuthor} onOpenChange={setShowEditAuthor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Author</DialogTitle>
            <DialogDescription>Update author information and settings</DialogDescription>
          </DialogHeader>
          {selectedAuthor && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedAuthor.name || selectedAuthor.displayName || ""}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={selectedAuthor.email}
                  placeholder="author@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-level">Author Level</Label>
                  <Select defaultValue={selectedAuthor.authorLevel || "Emerging"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emerging">Emerging</SelectItem>
                      <SelectItem value="Rising">Rising</SelectItem>
                      <SelectItem value="Established">Established</SelectItem>
                      <SelectItem value="Bestseller">Bestseller</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedAuthor.status || "Active"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-genre">Primary Genre</Label>
                <Input
                  id="edit-genre"
                  defaultValue={selectedAuthor.genre || ""}
                  placeholder="Fiction, Non-fiction, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bio">Biography</Label>
                <Textarea
                  id="edit-bio"
                  defaultValue={selectedAuthor.bio || ""}
                  placeholder="Brief author biography..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditAuthor} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditAuthor(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
