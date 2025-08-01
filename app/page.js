'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Upload, Play, Pause, MessageSquare, FileAudio, DollarSign, Settings, Home, FolderOpen, Users, Bell, Plus, Send, Download, Share2, Volume2, MoreHorizontal, X } from 'lucide-react'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [projects, setProjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [audioFiles, setAudioFiles] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [commentTime, setCommentTime] = useState(0)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceForm, setInvoiceForm] = useState({
    clientName: '',
    clientAddress: '',
    clientVAT: '',
    items: [{ description: '', quantity: '', unitPrice: '', vatRate: 20 }],
    rib: ''
  })
  const audioRef = useRef(null)
  const fileInputRef = useRef(null)

  // Sample data
  useEffect(() => {
    const sampleProjects = [
      {
        id: '1',
        name: 'Summer EP Recording',
        artist: 'The Midnight Collective',
        status: 'Recording',
        progress: 65,
        lastActivity: '2 hours ago',
        files: 8,
        type: 'Recording'
      },
      {
        id: '2', 
        name: 'Podcast Mix & Master',
        artist: 'Tech Talk Weekly',
        status: 'Mixing',
        progress: 30,
        lastActivity: '1 day ago',
        files: 12,
        type: 'Mixing'
      },
      {
        id: '3',
        name: 'Album Mastering',
        artist: 'Sarah Johnson',
        status: 'Mastering',
        progress: 90,
        lastActivity: '3 hours ago',
        files: 15,
        type: 'Mastering'
      }
    ]

    const sampleSessions = [
      {
        id: '1',
        title: 'Recording Session - Lead Vocals',
        project: 'Summer EP Recording',
        date: '2024-06-20',
        time: '14:00',
        duration: '3 hours',
        status: 'Confirmed',
        type: 'Recording'
      },
      {
        id: '2',
        title: 'Mix Review Session',
        project: 'Podcast Mix & Master',
        date: '2024-06-21',
        time: '10:00',
        duration: '2 hours',
        status: 'Pending',
        type: 'Mixing'
      }
    ]

    const sampleMessages = [
      {
        id: '1',
        user: 'Alex (Engineer)',
        message: 'Just uploaded the latest mix. Please review the vocal levels in the chorus.',
        time: '10:30 AM',
        avatar: 'AE'
      },
      {
        id: '2', 
        user: 'Sarah (Artist)',
        message: 'Sounds great! Could we try a bit more reverb on the bridge section?',
        time: '11:15 AM',
        avatar: 'SA'
      },
      {
        id: '3',
        user: 'Alex (Engineer)',
        message: 'Absolutely! I\'ll make that adjustment and have it ready for tomorrow\'s session.',
        time: '11:18 AM',
        avatar: 'AE'
      }
    ]

    const sampleAudioFiles = [
      {
        id: '1',
        name: 'Summer_Nights_v3.wav',
        version: 'v3',
        size: '45.2 MB',
        duration: '3:42',
        uploadedBy: 'Alex',
        uploadedAt: '2 hours ago',
        type: 'mix'
      },
      {
        id: '2',
        name: 'Summer_Nights_v2.wav', 
        version: 'v2',
        size: '44.8 MB',
        duration: '3:42',
        uploadedBy: 'Alex',
        uploadedAt: '1 day ago',
        type: 'mix'
      },
      {
        id: '3',
        name: 'Lead_Vocal_Take_5.wav',
        version: 'Take 5',
        size: '28.1 MB', 
        duration: '3:42',
        uploadedBy: 'Sarah',
        uploadedAt: '3 days ago',
        type: 'recording'
      }
    ]

    const sampleComments = [
      {
        id: '1',
        user: 'Sarah',
        comment: 'Love the energy here, but could we try a different vocal approach?',
        time: 45.2,
        timestamp: '0:45',
        avatar: 'SA'
      },
      {
        id: '2',
        user: 'Alex',
        comment: 'The bass feels a bit muddy in this section',
        time: 128.5,
        timestamp: '2:08',
        avatar: 'AE'
      }
    ]

    setProjects(sampleProjects)
    setSessions(sampleSessions)
    setMessages(sampleMessages)
    setAudioFiles(sampleAudioFiles)
    setComments(sampleComments)
    setSelectedProject(sampleProjects[0])
  }, [])

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Simulate chunked upload
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          // Add file to list
          const newFile = {
            id: Date.now().toString(),
            name: file.name,
            version: 'v1',
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            duration: '3:42',
            uploadedBy: 'You',
            uploadedAt: 'Just now',
            type: 'recording'
          }
          setAudioFiles(prev => [newFile, ...prev])
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        user: 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        avatar: 'YO'
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        user: 'You',
        comment: newComment,
        time: commentTime,
        timestamp: `${Math.floor(commentTime / 60)}:${String(Math.floor(commentTime % 60)).padStart(2, '0')}`,
        avatar: 'YO'
      }
      setComments(prev => [...prev, comment].sort((a, b) => a.time - b.time))
      setNewComment('')
    }
  }

  // Fonctions pour la gestion des factures
  const addInvoiceItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: '', unitPrice: '', vatRate: 20 }]
    }))
  }

  const removeInvoiceItem = (index) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const updateInvoiceItem = useCallback((index, field, value) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }, [])

  const handleNumberInput = useCallback((index, field, value) => {
    // Pour les champs numériques, on garde la valeur comme string si elle est vide
    // et on ne convertit en nombre que si c'est valide
    const numValue = value === '' ? '' : parseFloat(value)
    if (value === '' || !isNaN(numValue)) {
      updateInvoiceItem(index, field, value === '' ? '' : numValue)
    }
  }, [updateInvoiceItem])

  const handleInputChange = useCallback((field, value) => {
    setInvoiceForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const calculateItemTotal = (item) => {
    const quantity = item.quantity || 0
    const unitPrice = item.unitPrice || 0
    const vatRate = item.vatRate || 0
    
    const subtotal = quantity * unitPrice
    const vatAmount = subtotal * (vatRate / 100)
    return {
      subtotal,
      vatAmount,
      total: subtotal + vatAmount
    }
  }

  const calculateInvoiceTotals = useMemo(() => {
    return invoiceForm.items.reduce((totals, item) => {
      const itemTotals = calculateItemTotal(item)
      return {
        subtotal: totals.subtotal + itemTotals.subtotal,
        vatAmount: totals.vatAmount + itemTotals.vatAmount,
        total: totals.total + itemTotals.total
      }
    }, { subtotal: 0, vatAmount: 0, total: 0 })
  }, [invoiceForm.items])

  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `FACT-${year}${month}${day}-${random}`
  }

  const handleCreateInvoice = async () => {
    const invoiceData = {
      invoiceNumber: generateInvoiceNumber(),
      clientName: invoiceForm.clientName,
      clientAddress: invoiceForm.clientAddress,
      clientVAT: invoiceForm.clientVAT,
      items: invoiceForm.items.map(item => ({
        ...item,
        ...calculateItemTotal(item)
      })),
      totals: calculateInvoiceTotals,
      rib: invoiceForm.rib,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours
      status: 'pending'
    }

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Facture créée:', result)
        setShowInvoiceModal(false)
        setInvoiceForm({
          clientName: '',
          clientAddress: '',
          clientVAT: '',
          items: [{ description: '', quantity: '', unitPrice: '', vatRate: 20 }],
          rib: ''
        })
        // Ici vous pourriez ajouter une notification de succès
      }
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error)
    }
  }

  const Sidebar = () => (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">StudioMate</h1>
        <p className="text-sm text-muted-foreground">Professional Audio Platform</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        <Button 
          variant={currentView === 'dashboard' ? 'default' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => setCurrentView('dashboard')}
        >
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button 
          variant={currentView === 'projects' ? 'default' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => setCurrentView('projects')}
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Projects
        </Button>
        <Button 
          variant={currentView === 'sessions' ? 'default' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => setCurrentView('sessions')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Sessions
        </Button>
        <Button 
          variant={currentView === 'billing' ? 'default' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => setCurrentView('billing')}
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Billing
        </Button>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>AE</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Alex Engineer</p>
            <p className="text-xs text-muted-foreground">alex@studio.com</p>
          </div>
        </div>
      </div>
    </div>
  )

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Alex! Here's what's happening in your studio.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week's Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 confirmed, 5 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,200</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Processed</CardTitle>
            <FileAudio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+8 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.slice(0, 3).map(project => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <Badge variant="outline">{project.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.artist}</p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedProject(project)
                  setCurrentView('projects')
                }}>
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map(session => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-muted-foreground">{session.project}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{session.date}</span>
                      <span>•</span>
                      <span>{session.time}</span>
                      <span>•</span>
                      <span>{session.duration}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={session.status === 'Confirmed' ? 'default' : 'secondary'}>
                  {session.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const ProjectsView = () => (
    <div className="space-y-6">
      {!selectedProject ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">Projects</h2>
              <p className="text-muted-foreground">Manage your recording, mixing, and mastering projects.</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedProject(project)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant="outline">{project.type}</Badge>
                  </div>
                  <CardDescription>{project.artist}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <FileAudio className="h-4 w-4 text-muted-foreground" />
                        <span>{project.files} files</span>
                      </div>
                      <span className="text-muted-foreground">{project.lastActivity}</span>
                    </div>
                    
                    <Badge className={
                      project.status === 'Recording' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'Mixing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {project.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <ProjectWorkspace />
      )}
    </div>
  )

  const ProjectWorkspace = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setSelectedProject(null)}>
            ←
          </Button>
          <div>
            <h2 className="text-3xl font-bold">{selectedProject.name}</h2>
            <p className="text-muted-foreground">{selectedProject.artist} • {selectedProject.status}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Player */}
          <Card>
            <CardHeader>
              <CardTitle>Audio Player</CardTitle>
              <CardDescription>Summer_Nights_v3.wav</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button size="sm" onClick={playPause}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <div className="flex-1 space-y-2">
                  <div className="h-12 bg-muted rounded flex items-center px-2">
                    <div className="w-full h-8 bg-gradient-to-r from-primary/20 to-primary/40 rounded relative">
                      <div className="absolute inset-0 bg-primary/60 rounded" style={{width: '35%'}}></div>
                      {comments.map(comment => (
                        <div 
                          key={comment.id}
                          className="absolute top-0 w-1 h-full bg-yellow-500 cursor-pointer"
                          style={{left: `${(comment.time / 222) * 100}%`}}
                          title={`${comment.timestamp}: ${comment.comment}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0:00</span>
                    <span>3:42</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Add Comment */}
              <div className="flex space-x-2">
                <Input 
                  placeholder="Add comment at current time..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Input 
                  type="number"
                  placeholder="Time (s)"
                  value={commentTime}
                  onChange={(e) => setCommentTime(Number(e.target.value))}
                  className="w-24"
                />
                <Button onClick={addComment}>Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Comments & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-3 p-3 rounded-lg border border-border">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{comment.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{comment.user}</span>
                      <Badge variant="outline" className="text-xs">{comment.timestamp}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* File Versions */}
          <Card>
            <CardHeader>
              <CardTitle>File Versions</CardTitle>
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="audio/*"
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Version
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
              
              <div className="space-y-3">
                {audioFiles.map(file => (
                  <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <FileAudio className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{file.name}</span>
                          <Badge variant="outline">{file.version}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <span>{file.size}</span>
                          <span>•</span>
                          <span>{file.duration}</span>
                          <span>•</span>
                          <span>by {file.uploadedBy}</span>
                          <span>•</span>
                          <span>{file.uploadedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Sidebar */}
        <div className="space-y-6">
          <Card className="h-96">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Chat</span>
                <Button size="sm" variant="outline">
                  <Users className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map(message => (
                  <div key={message.id} className="flex space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium">{message.user}</span>
                        <span className="text-xs text-muted-foreground">{message.time}</span>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <Button size="sm" onClick={sendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Badge className="ml-2">{selectedProject.status}</Badge>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Progress</Label>
                <div className="mt-1">
                  <Progress value={selectedProject.progress} />
                  <span className="text-xs text-muted-foreground">{selectedProject.progress}% complete</span>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Files</Label>
                <p className="text-sm">{selectedProject.files} uploaded</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Last Activity</Label>
                <p className="text-sm">{selectedProject.lastActivity}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const SessionsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Sessions</h2>
          <p className="text-muted-foreground">Schedule and manage your recording sessions.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Session
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>June 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 font-medium text-muted-foreground">{day}</div>
                ))}
                {Array.from({length: 30}, (_, i) => i + 1).map(day => (
                  <div key={day} className="p-2 border border-border rounded hover:bg-muted cursor-pointer">
                    <div className="text-sm">{day}</div>
                    {(day === 20 || day === 21) && (
                      <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {sessions.map(session => (
              <Card key={session.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{session.title}</h3>
                        <p className="text-sm text-muted-foreground">{session.project}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{session.date}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{session.time}</span>
                          <span>•</span>
                          <span>{session.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={session.status === 'Confirmed' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const BillingView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Billing</h2>
          <p className="text-muted-foreground">Manage invoices, payments, and billing.</p>
        </div>
        <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle facture</DialogTitle>
              <DialogDescription>
                Remplissez les informations du client et les détails de la facture.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Informations du client */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informations du client</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clientName">Nom du client *</Label>
                    <Input
                      id="clientName"
                      key="clientName"
                      value={invoiceForm.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      placeholder="Nom de l'entreprise ou du client"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientVAT">Numéro de TVA</Label>
                    <Input
                      id="clientVAT"
                      key="clientVAT"
                      value={invoiceForm.clientVAT}
                      onChange={(e) => handleInputChange('clientVAT', e.target.value)}
                      placeholder="FR12345678901"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="clientAddress">Adresse complète *</Label>
                  <Textarea
                    id="clientAddress"
                    key="clientAddress"
                    value={invoiceForm.clientAddress}
                    onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                    placeholder="Adresse complète du client"
                    rows={3}
                  />
                </div>
              </div>

              {/* Articles de la facture */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Articles de la facture</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un article
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {invoiceForm.items.map((item, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Article {index + 1}</h4>
                        {invoiceForm.items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeInvoiceItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor={`description-${index}`}>Description du service *</Label>
                          <Input
                            id={`description-${index}`}
                            key={`description-${index}`}
                            value={item.description}
                            onChange={(e) => updateInvoiceItem(index, 'description', e.target.value)}
                            placeholder="Description détaillée du service"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`quantity-${index}`}>Quantité</Label>
                          <Input
                            id={`quantity-${index}`}
                            key={`quantity-${index}`}
                            type="number"
                            min="1"
                            value={item.quantity || ''}
                            onChange={(e) => handleNumberInput(index, 'quantity', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`unitPrice-${index}`}>Prix unitaire HT (€)</Label>
                          <Input
                            id={`unitPrice-${index}`}
                            key={`unitPrice-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice || ''}
                            onChange={(e) => handleNumberInput(index, 'unitPrice', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`vatRate-${index}`}>Taux de TVA (%)</Label>
                          <Select
                            key={`vatRate-${index}`}
                            value={item.vatRate.toString()}
                            onValueChange={(value) => updateInvoiceItem(index, 'vatRate', parseInt(value))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5.5">5.5%</SelectItem>
                              <SelectItem value="10">10%</SelectItem>
                              <SelectItem value="20">20%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Montant HT</Label>
                          <div className="text-lg font-semibold">
                            {((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)} €
                          </div>
                        </div>
                        <div>
                          <Label>Montant TVA</Label>
                          <div className="text-lg font-semibold">
                            {((item.quantity || 0) * (item.unitPrice || 0) * ((item.vatRate || 0) / 100)).toFixed(2)} €
                          </div>
                        </div>
                        <div>
                          <Label>Total TTC</Label>
                          <div className="text-lg font-semibold text-primary">
                            {((item.quantity || 0) * (item.unitPrice || 0) * (1 + (item.vatRate || 0) / 100)).toFixed(2)} €
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totaux */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total HT:</span>
                    <span className="font-semibold">{calculateInvoiceTotals.subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total TVA:</span>
                    <span className="font-semibold">{calculateInvoiceTotals.vatAmount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total TTC:</span>
                    <span className="text-primary">{calculateInvoiceTotals.total.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* RIB */}
              <div>
                <Label htmlFor="rib">RIB (Relevé d'Identité Bancaire)</Label>
                <Textarea
                  id="rib"
                  key="rib"
                  value={invoiceForm.rib}
                  onChange={(e) => handleInputChange('rib', e.target.value)}
                  placeholder="Votre RIB pour le paiement"
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateInvoice}>
                Créer la facture
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$12,450</div>
            <p className="text-sm text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Pending Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$2,100</div>
            <p className="text-sm text-muted-foreground">3 invoices awaiting payment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$4,200</div>
            <p className="text-sm text-muted-foreground">8 sessions completed</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: '001', client: 'The Midnight Collective', amount: '$750', status: 'Paid', date: '2024-06-15' },
              { id: '002', client: 'Sarah Johnson', amount: '$1200', status: 'Pending', date: '2024-06-18' },
              { id: '003', client: 'Tech Talk Weekly', amount: '$600', status: 'Paid', date: '2024-06-20' }
            ].map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Invoice #{invoice.id}</span>
                    <Badge variant={invoice.status === 'Paid' ? 'default' : 'secondary'}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{invoice.client} • {invoice.date}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{invoice.amount}</div>
                  <Button variant="outline" size="sm" className="mt-1">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'projects' && <ProjectsView />}
          {currentView === 'sessions' && <SessionsView />}
          {currentView === 'billing' && <BillingView />}
        </div>
      </main>
    </div>
  )
}