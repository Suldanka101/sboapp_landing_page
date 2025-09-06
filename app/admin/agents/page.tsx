"use client"

import { useState } from "react"
import { useRealtimeUsers } from "@/hooks/use-realtime-data"
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
import {
  UserCheck,
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
  Shield,
  Activity,
  Calendar,
} from "lucide-react"

interface Agent {
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
  agentLevel?: string
  territory?: string
  commission?: number
  totalSales?: number
}

export default function AgentsManagementPage() {
  const { users, loading } = useRealtimeUsers()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterLevel, setFilterLevel] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showAddAgent, setShowAddAgent] = useState(false)
  const [showViewAgent, setShowViewAgent] = useState(false)
  const [showEditAgent, setShowEditAgent] = useState(false)
  const [newAgent, setNewAgent] = useState({
    email: "",
    name: "",
    status: "Active",
    agentLevel: "Junior",
    territory: "",
    commission: 5,
  })

  const itemsPerPage = 10

  // Filter agents (users with Agent role)
  const agents = users?.filter((user) => user.role === "Agent") || []

  const filteredAgents = agents.filter((agent: Agent) => {
    const matchesSearch =
      agent.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.displayName?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || agent.status === filterStatus
    const matchesLevel = filterLevel === "all" || agent.agentLevel === filterLevel

    return matchesSearch && matchesStatus && matchesLevel
  })

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAgents = filteredAgents.slice(startIndex, startIndex + itemsPerPage)

  const handleAddAgent = () => {
    // Add agent logic here
    console.log("Adding agent:", newAgent)
    setShowAddAgent(false)
    setNewAgent({ email: "", name: "", status: "Active", agentLevel: "Junior", territory: "", commission: 5 })
  }

  const handleEditAgent = () => {
    // Edit agent logic here
    console.log("Editing agent:", selectedAgent)
    setShowEditAgent(false)
  }

  const handleDeleteAgent = (agentId: string) => {
    // Delete agent logic here
    console.log("Deleting agent:", agentId)
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
      case "Senior":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "Mid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Junior":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const activeAgents = agents.filter((agent) => agent.status === "Active").length
  const totalCommission = agents.reduce((sum, agent) => sum + (agent.commission || 0), 0)
  const totalSales = agents.reduce((sum, agent) => sum + (agent.totalSales || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-primary" />
            Agents Management
          </h1>
          <p className="text-muted-foreground">Manage platform agents and their territories</p>
        </div>
        <Dialog open={showAddAgent} onOpenChange={setShowAddAgent}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
              <DialogDescription>Create a new agent account for the platform</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                  placeholder="agent@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agentLevel">Agent Level</Label>
                  <Select
                    value={newAgent.agentLevel}
                    onValueChange={(value) => setNewAgent({ ...newAgent, agentLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newAgent.status}
                    onValueChange={(value) => setNewAgent({ ...newAgent, status: value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="territory">Territory</Label>
                  <Input
                    id="territory"
                    value={newAgent.territory}
                    onChange={(e) => setNewAgent({ ...newAgent, territory: e.target.value })}
                    placeholder="North America"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission">Commission (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    value={newAgent.commission}
                    onChange={(e) => setNewAgent({ ...newAgent, commission: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAgent} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Agent
                </Button>
                <Button variant="outline" onClick={() => setShowAddAgent(false)}>
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
                <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                <p className="text-2xl font-bold text-foreground">{agents.length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold text-foreground">{activeAgents}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Commission</p>
                <p className="text-2xl font-bold text-foreground">
                  {agents.length > 0 ? (totalCommission / agents.length).toFixed(1) : 0}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold text-foreground">${totalSales.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
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
                placeholder="Search agents by name or email..."
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
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Mid">Mid</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
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

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Agents ({filteredAgents.length})</CardTitle>
          <CardDescription>Manage agent accounts and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading agents...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Territory</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAgents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {(agent.name || agent.displayName || agent.email)?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {agent.name || agent.displayName || "Anonymous"}
                            </p>
                            <p className="text-sm text-muted-foreground">{agent.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(agent.agentLevel || "Junior")}>
                          {agent.agentLevel || "Junior"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(agent.status || "Active")}>{agent.status || "Active"}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground">{agent.territory || "Not assigned"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground">{agent.commission || 5}%</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground">${(agent.totalSales || 0).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog
                            open={showViewAgent && selectedAgent?.id === agent.id}
                            onOpenChange={(open) => {
                              setShowViewAgent(open)
                              if (!open) setSelectedAgent(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedAgent(agent)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Agent Details</DialogTitle>
                                <DialogDescription>View agent information and performance</DialogDescription>
                              </DialogHeader>
                              {selectedAgent && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Name</Label>
                                      <p className="text-foreground">
                                        {selectedAgent.name || selectedAgent.displayName || "Not provided"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Email</Label>
                                      <p className="text-foreground">{selectedAgent.email}</p>
                                    </div>
                                    <div>
                                      <Label>Agent Level</Label>
                                      <Badge className={getLevelColor(selectedAgent.agentLevel || "Junior")}>
                                        {selectedAgent.agentLevel || "Junior"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <Badge className={getStatusColor(selectedAgent.status || "Active")}>
                                        {selectedAgent.status || "Active"}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Territory</Label>
                                      <p className="text-foreground">{selectedAgent.territory || "Not assigned"}</p>
                                    </div>
                                    <div>
                                      <Label>Commission Rate</Label>
                                      <p className="text-foreground">{selectedAgent.commission || 5}%</p>
                                    </div>
                                    <div>
                                      <Label>Total Sales</Label>
                                      <p className="text-foreground">
                                        ${(selectedAgent.totalSales || 0).toLocaleString()}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Books Managed</Label>
                                      <p className="text-foreground">{selectedAgent.booksRead || 0}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAgent(agent)
                              setShowEditAgent(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAgent(agent.id)}
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
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAgents.length)} of{" "}
                    {filteredAgents.length} agents
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

      {/* Edit Agent Dialog */}
      <Dialog open={showEditAgent} onOpenChange={setShowEditAgent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
            <DialogDescription>Update agent information and settings</DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedAgent.name || selectedAgent.displayName || ""}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={selectedAgent.email}
                  placeholder="agent@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-level">Agent Level</Label>
                  <Select defaultValue={selectedAgent.agentLevel || "Junior"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue={selectedAgent.status || "Active"}>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-territory">Territory</Label>
                  <Input id="edit-territory" defaultValue={selectedAgent.territory || ""} placeholder="North America" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-commission">Commission (%)</Label>
                  <Input
                    id="edit-commission"
                    type="number"
                    min="0"
                    max="100"
                    defaultValue={selectedAgent.commission || 5}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEditAgent} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditAgent(false)}>
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
