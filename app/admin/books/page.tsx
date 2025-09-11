"use client"

import type React from "react"

import { useState } from "react"
import { useRealtimeBooks } from "@/hooks/use-realtime-data"
import { addBookToRealtime } from "@/lib/firebase-realtime"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react"

interface Book {
  id: string
  title?: string
  author?: string
  category?: string
  description?: string
  coverImage?: string
  pdfUrl?: string
  price?: number
  status?: string
  likes?: number
  downloads?: number
  publishDate?: string
  lastUpdated?: string
}

export default function BooksManagementPage() {
  const { books, loading } = useRealtimeBooks()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showAddBook, setShowAddBook] = useState(false)
  const [showViewBook, setShowViewBook] = useState(false)
  const [showEditBook, setShowEditBook] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
    coverImage: "",
    pdfUrl: "",
    price: 0,
    status: "Draft" as "Draft" | "Published",
  })

  const itemsPerPage = 10

  // Get unique categories for filter
  const categories = Array.from(new Set(books?.map((book) => book.category).filter(Boolean))) || []

  const filteredBooks =
    books?.filter((book: Book) => {
      const matchesSearch =
        book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.status?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = filterStatus === "all" || book.status === filterStatus
      const matchesCategory = filterCategory === "all" || book.category === filterCategory

      return matchesSearch && matchesStatus && matchesCategory
    }) || []

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage)

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      await addBookToRealtime(newBook)
      setNewBook({
        title: "",
        author: "",
        category: "",
        description: "",
        coverImage: "",
        pdfUrl: "",
        price: 0,
        status: "Draft",
      })
      setShowAddBook(false)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to add book")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditBook = () => {
    // Edit book logic here
    console.log("Editing book:", selectedBook)
    setShowEditBook(false)
  }

  const handleDeleteBook = (bookId: string) => {
    // Delete book logic here
    console.log("Deleting book:", bookId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const totalBooks = books?.length || 0
  const publishedBooks = books?.filter((book) => book.status === "Published").length || 0
  const draftBooks = books?.filter((book) => book.status === "Draft").length || 0
  const totalDownloads = books?.reduce((sum, book) => sum + (book.downloads || 0), 0) || 0
  const totalLikes = books?.reduce((sum, book) => sum + (book.likes || 0), 0) || 0
  const avgPrice = books?.length
    ? (books.reduce((sum, book) => sum + (book.price || 0), 0) / books.length).toFixed(2)
    : "0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Books Management
          </h1>
          <p className="text-muted-foreground">Manage your digital library collection</p>
        </div>
        <Dialog open={showAddBook} onOpenChange={setShowAddBook}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>Add a new book to your digital library</DialogDescription>
            </DialogHeader>
            {submitError && (
              <Alert variant="destructive">
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                    placeholder="Book title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                    placeholder="Author name"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={newBook.category}
                    onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                    placeholder="e.g., Fiction, History"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newBook.price}
                    onChange={(e) => setNewBook({ ...newBook, price: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={newBook.coverImage}
                    onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdfUrl">PDF URL</Label>
                  <Input
                    id="pdfUrl"
                    value={newBook.pdfUrl}
                    onChange={(e) => setNewBook({ ...newBook, pdfUrl: e.target.value })}
                    placeholder="https://example.com/book.pdf"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newBook.status}
                  onValueChange={(value: "Draft" | "Published") => setNewBook({ ...newBook, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  placeholder="Book description..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Book...
                    </>
                  ) : (
                    "Add Book"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddBook(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Books</p>
                <p className="text-2xl font-bold text-foreground">{totalBooks}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-foreground">{publishedBooks}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold text-foreground">{totalDownloads.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Price</p>
                <p className="text-2xl font-bold text-foreground">${avgPrice}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
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
                placeholder="Search books by title, author, category, description, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>Books ({filteredBooks.length})</CardTitle>
          <CardDescription>Manage your book collection and monitor performance</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading books...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Book</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Downloads</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBooks.map((book) => (
                    <TableRow key={book.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-16 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center overflow-hidden">
                            {book.coverImage ? (
                              <img
                                src={book.coverImage || "/placeholder.svg"}
                                alt={book.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <BookOpen className="h-6 w-6 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{book.title}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {book.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground">{book.author}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{book.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(book.status || "Draft")}>{book.status || "Draft"}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground">
                          {book.price && book.price > 0 ? `$${book.price}` : "Free"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{(book.downloads || 0).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-foreground">{book.likes || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog
                            open={showViewBook && selectedBook?.id === book.id}
                            onOpenChange={(open) => {
                              setShowViewBook(open)
                              if (!open) setSelectedBook(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedBook(book)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Book Details</DialogTitle>
                                <DialogDescription>View complete book information</DialogDescription>
                              </DialogHeader>
                              {selectedBook && (
                                <div className="space-y-6">
                                  <div className="flex items-start space-x-4">
                                    <div className="w-24 h-32 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center overflow-hidden">
                                      {selectedBook.coverImage ? (
                                        <img
                                          src={selectedBook.coverImage || "/placeholder.svg"}
                                          alt={selectedBook.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <BookOpen className="h-8 w-8 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <h3 className="text-xl font-bold text-foreground">{selectedBook.title}</h3>
                                      <p className="text-muted-foreground">by {selectedBook.author}</p>
                                      <div className="flex items-center space-x-2">
                                        <Badge className={getStatusColor(selectedBook.status || "Draft")}>
                                          {selectedBook.status || "Draft"}
                                        </Badge>
                                        <Badge variant="outline">{selectedBook.category}</Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-primary">
                                        {(selectedBook.downloads || 0).toLocaleString()}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Downloads</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-primary">{selectedBook.likes || 0}</p>
                                      <p className="text-sm text-muted-foreground">Likes</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-2xl font-bold text-primary">
                                        {selectedBook.price && selectedBook.price > 0
                                          ? `$${selectedBook.price}`
                                          : "Free"}
                                      </p>
                                      <p className="text-sm text-muted-foreground">Price</p>
                                    </div>
                                  </div>

                                  {selectedBook.description && (
                                    <div>
                                      <Label>Description</Label>
                                      <p className="text-foreground text-sm mt-1">{selectedBook.description}</p>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-4">
                                    {selectedBook.pdfUrl && (
                                      <div>
                                        <Label>PDF URL</Label>
                                        <p className="text-foreground text-sm mt-1 truncate">{selectedBook.pdfUrl}</p>
                                      </div>
                                    )}
                                    {selectedBook.coverImage && (
                                      <div>
                                        <Label>Cover Image URL</Label>
                                        <p className="text-foreground text-sm mt-1 truncate">
                                          {selectedBook.coverImage}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedBook(book)
                              setShowEditBook(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBook(book.id)}
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
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBooks.length)} of{" "}
                    {filteredBooks.length} books
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

      {/* Edit Book Dialog */}
      <Dialog open={showEditBook} onOpenChange={setShowEditBook}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>Update book information and settings</DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input id="edit-title" defaultValue={selectedBook.title || ""} placeholder="Book title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-author">Author</Label>
                  <Input id="edit-author" defaultValue={selectedBook.author || ""} placeholder="Author name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Input
                    id="edit-category"
                    defaultValue={selectedBook.category || ""}
                    placeholder="e.g., Fiction, History"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={selectedBook.price || 0}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-coverImage">Cover Image URL</Label>
                  <Input
                    id="edit-coverImage"
                    defaultValue={selectedBook.coverImage || ""}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pdfUrl">PDF URL</Label>
                  <Input
                    id="edit-pdfUrl"
                    defaultValue={selectedBook.pdfUrl || ""}
                    placeholder="https://example.com/book.pdf"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedBook.status || "Draft"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  defaultValue={selectedBook.description || ""}
                  placeholder="Book description..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditBook} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditBook(false)}>
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
