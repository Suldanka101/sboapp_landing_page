import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Download,
  Star,
  Users,
  Smartphone,
  Heart,
  Search,
  Bookmark,
  LogIn,
  Calendar,
  ArrowRight,
  Clock,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function SBOAppLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SBO</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Reviews
            </a>
            <a href="#download" className="text-muted-foreground hover:text-foreground transition-colors">
              Download
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Download className="h-4 w-4 mr-2" />
              Download Now
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-card via-background to-muted">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">Your Digital Library Awaits</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-balance mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Discover Books Like Never Before
          </h1>
          <p className="text-xl text-muted-foreground text-pretty mb-8 leading-relaxed">
            SBO APP transforms your mobile device into a premium digital library. Access thousands of books, enjoy
            personalized recommendations, and read offline anywhere, anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              <Download className="h-5 w-5 mr-2" />
              Download for Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Explore Library
            </Button>
          </div>

          {/* App Preview */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-8 backdrop-blur-sm border border-border shadow-2xl">
              <div className="bg-card rounded-2xl p-6 shadow-2xl max-w-sm mx-auto border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">SBO APP</span>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                  <div className="h-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border border-border/50">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-3 bg-muted rounded flex-1 animate-pulse"></div>
                    <div className="h-3 bg-accent/50 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Everything You Need for Digital Reading
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Experience the future of reading with our comprehensive suite of features designed for book lovers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:bg-card/80 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Smart Discovery</CardTitle>
                <CardDescription>
                  AI-powered recommendations based on your reading history and preferences.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-accent/30 hover:bg-card/80 group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Smartphone className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-card-foreground">Offline Reading</CardTitle>
                <CardDescription>
                  Download books and read anywhere, even without an internet connection.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:bg-card/80 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Bookmark className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Personal Library</CardTitle>
                <CardDescription>
                  Organize your collection with custom shelves, tags, and reading lists.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-accent/30 hover:bg-card/80 group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-card-foreground">Reading Community</CardTitle>
                <CardDescription>
                  Connect with fellow readers, share reviews, and discover new favorites.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 hover:bg-card/80 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Reading Analytics</CardTitle>
                <CardDescription>Track your reading progress, set goals, and celebrate achievements.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-accent/30 hover:bg-card/80 group">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-card-foreground">Multiple Formats</CardTitle>
                <CardDescription>
                  Support for EPUB, PDF, MOBI, and more with customizable reading experience.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Reading Insights & Tips</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Discover the latest trends in digital reading, book recommendations, and tips to enhance your reading
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Blog Post */}
            <Card className="md:col-span-2 lg:col-span-1 border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 15, 2024</span>
                  <Badge variant="secondary" className="text-xs">
                    Featured
                  </Badge>
                </div>
                <CardTitle className="text-card-foreground group-hover:text-primary transition-colors">
                  The Future of Digital Reading: AI-Powered Book Discovery
                </CardTitle>
                <CardDescription>
                  Explore how artificial intelligence is revolutionizing the way we discover and consume books, making
                  personalized recommendations more accurate than ever.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>5 min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blog Post 2 */}
            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-accent/30 group">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-t-lg flex items-center justify-center">
                <Smartphone className="h-12 w-12 text-accent" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 12, 2024</span>
                </div>
                <CardTitle className="text-card-foreground group-hover:text-accent transition-colors">
                  10 Tips for Better Mobile Reading
                </CardTitle>
                <CardDescription>
                  Maximize your mobile reading experience with these proven strategies for comfort, focus, and
                  retention.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>3 min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-accent">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blog Post 3 */}
            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 10, 2024</span>
                </div>
                <CardTitle className="text-card-foreground group-hover:text-primary transition-colors">
                  Building Healthy Reading Habits
                </CardTitle>
                <CardDescription>
                  Learn how to create sustainable reading routines that fit into your busy lifestyle and help you read
                  more consistently.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>4 min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blog Post 4 */}
            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-accent/30 group">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-t-lg flex items-center justify-center">
                <Search className="h-12 w-12 text-accent" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 8, 2024</span>
                </div>
                <CardTitle className="text-card-foreground group-hover:text-accent transition-colors">
                  Discovering Hidden Literary Gems
                </CardTitle>
                <CardDescription>
                  Uncover amazing books that might have slipped under your radar with our curated selection of
                  underrated masterpieces.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>6 min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-accent">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blog Post 5 */}
            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 group">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 5, 2024</span>
                </div>
                <CardTitle className="text-card-foreground group-hover:text-primary transition-colors">
                  Building Your Reading Community
                </CardTitle>
                <CardDescription>
                  Connect with fellow book lovers, join reading challenges, and share your literary journey with
                  like-minded readers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>5 min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-primary">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Blog Post 6 */}
            <Card className="border-border hover:shadow-xl transition-all duration-300 hover:border-accent/30 group">
              <div className="aspect-video bg-gradient-to-br from-accent/20 to-primary/20 rounded-t-lg flex items-center justify-center">
                <Bookmark className="h-12 w-12 text-accent" />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>December 3, 2024</span>
                </div>
                <CardTitle className="text-card-foreground group-hover:text-accent transition-colors">
                  Organizing Your Digital Library
                </CardTitle>
                <CardDescription>
                  Master the art of digital book organization with tags, collections, and smart categorization
                  strategies.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>4 min read</span>
                  </div>
                  <Button variant="ghost" size="sm" className="group-hover:text-accent">
                    Read More <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Blog CTA */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              View All Articles <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Loved by Readers Worldwide</h2>
            <p className="text-xl text-muted-foreground text-pretty">
              Join thousands of satisfied readers who've transformed their reading experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 text-pretty">
                  "SBO APP has completely changed how I read. The offline feature is perfect for my commute, and the
                  recommendations are spot-on!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">SM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Sarah Mitchell</p>
                    <p className="text-sm text-muted-foreground">Avid Reader</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 text-pretty">
                  "The reading analytics feature helps me stay motivated. I've read more books this year than ever
                  before thanks to SBO APP."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">James Davis</p>
                    <p className="text-sm text-muted-foreground">Book Blogger</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-card-foreground mb-4 text-pretty">
                  "As a student, the ability to organize my textbooks and research materials in one place is invaluable.
                  Highly recommended!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">AL</span>
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground">Anna Lee</p>
                    <p className="text-sm text-muted-foreground">Graduate Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-20 px-4 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Start Your Reading Journey Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Join millions of readers who have discovered their next favorite book with SBO APP. Download now and get
            instant access to our entire library.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="h-5 w-5 mr-2" />
              Download for iOS
            </Button>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="h-5 w-5 mr-2" />
              Download for Android
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-muted-foreground">
            <div className="flex items-center bg-card/50 px-4 py-2 rounded-full border border-border">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">2M+ Downloads</span>
            </div>
            <div className="flex items-center bg-card/50 px-4 py-2 rounded-full border border-border">
              <Star className="h-5 w-5 mr-2 text-accent" />
              <span className="font-medium">4.8 Rating</span>
            </div>
            <div className="flex items-center bg-card/50 px-4 py-2 rounded-full border border-border">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              <span className="font-medium">50K+ Books</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-card-foreground">SBO APP</span>
              </div>
              <p className="text-muted-foreground text-pretty">
                Your premium digital library experience, designed for the modern reader.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Smart Discovery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Offline Reading
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Personal Library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Reading Analytics
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-card-foreground mb-4">Connect</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-card-foreground transition-colors">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SBO APP. All rights reserved. Made with ❤️ for book lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
