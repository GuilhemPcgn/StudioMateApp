import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

let client
let db

async function connectDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// GET handler
export async function GET(request, { params }) {
  try {
    const db = await connectDB()
    const path = params.path?.join('/') || ''
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)

    console.log('GET request to:', path)

    if (path === 'projects') {
      const projects = await db.collection('projects').find({}).toArray()
      return NextResponse.json({ success: true, data: projects })
    }

    if (path === 'sessions') {
      const sessions = await db.collection('sessions').find({}).toArray()
      return NextResponse.json({ success: true, data: sessions })
    }

    if (path.startsWith('projects/')) {
      const projectId = path.split('/')[1]
      const project = await db.collection('projects').findOne({ id: projectId })
      if (!project) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: project })
    }

    if (path === 'audio-files') {
      const projectId = searchParams.get('projectId')
      const query = projectId ? { projectId } : {}
      const audioFiles = await db.collection('audioFiles').find(query).toArray()
      return NextResponse.json({ success: true, data: audioFiles })
    }

    if (path === 'comments') {
      const projectId = searchParams.get('projectId')
      const fileId = searchParams.get('fileId')
      let query = {}
      if (projectId) query.projectId = projectId
      if (fileId) query.fileId = fileId
      
      const comments = await db.collection('comments').find(query).toArray()
      return NextResponse.json({ success: true, data: comments })
    }

    if (path === 'messages') {
      const projectId = searchParams.get('projectId')
      const query = projectId ? { projectId } : {}
      const messages = await db.collection('messages').find(query).sort({ createdAt: 1 }).toArray()
      return NextResponse.json({ success: true, data: messages })
    }

    if (path === 'invoices') {
      const invoices = await db.collection('invoices').find({}).toArray()
      return NextResponse.json({ success: true, data: invoices })
    }

    if (path === 'dashboard-stats') {
      const projectCount = await db.collection('projects').countDocuments()
      const sessionCount = await db.collection('sessions').countDocuments()
      const thisMonthSessions = await db.collection('sessions').countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      })
      const totalRevenue = await db.collection('invoices').aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray()

      return NextResponse.json({
        success: true,
        data: {
          activeProjects: projectCount,
          weekSessions: thisMonthSessions,
          monthRevenue: totalRevenue[0]?.total || 0,
          filesProcessed: 142
        }
      })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })

  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST handler
export async function POST(request, { params }) {
  try {
    const db = await connectDB()
    const path = params.path?.join('/') || ''
    const body = await request.json()

    console.log('POST request to:', path, 'with body:', body)

    if (path === 'projects') {
      const project = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('projects').insertOne(project)
      return NextResponse.json({ success: true, data: project })
    }

    if (path === 'sessions') {
      const session = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.collection('sessions').insertOne(session)
      
      // Send confirmation email (fake for now)
      console.log('Would send confirmation email for session:', session.id)
      
      return NextResponse.json({ success: true, data: session })
    }

    if (path === 'audio-files') {
      const audioFile = {
        id: uuidv4(),
        ...body,
        uploadedAt: new Date()
      }
      await db.collection('audioFiles').insertOne(audioFile)
      return NextResponse.json({ success: true, data: audioFile })
    }

    if (path === 'comments') {
      const comment = {
        id: uuidv4(),
        ...body,
        createdAt: new Date()
      }
      await db.collection('comments').insertOne(comment)
      return NextResponse.json({ success: true, data: comment })
    }

    if (path === 'messages') {
      const message = {
        id: uuidv4(),
        ...body,
        createdAt: new Date()
      }
      await db.collection('messages').insertOne(message)
      return NextResponse.json({ success: true, data: message })
    }

    if (path === 'invoices') {
      const invoice = {
        id: uuidv4(),
        ...body,
        createdAt: new Date(),
        status: 'pending'
      }
      await db.collection('invoices').insertOne(invoice)
      return NextResponse.json({ success: true, data: invoice })
    }

    if (path === 'upload') {
      // Handle chunked file upload
      const { fileName, chunk, totalChunks, chunkIndex, projectId } = body
      
      // In a real implementation, you'd save chunks to a temporary location
      // and combine them when all chunks are received
      console.log(`Received chunk ${chunkIndex + 1}/${totalChunks} for file ${fileName}`)
      
      if (chunkIndex === totalChunks - 1) {
        // Last chunk, finalize upload
        const audioFile = {
          id: uuidv4(),
          name: fileName,
          projectId,
          size: chunk.length * totalChunks, // Approximate
          uploadedAt: new Date(),
          uploadedBy: 'Current User',
          version: 'v1',
          type: 'recording'
        }
        await db.collection('audioFiles').insertOne(audioFile)
        return NextResponse.json({ success: true, data: audioFile, completed: true })
      }
      
      return NextResponse.json({ success: true, progress: ((chunkIndex + 1) / totalChunks) * 100 })
    }

    // Stripe payment endpoints (with fake processing)
    if (path === 'stripe/create-payment-intent') {
      const { amount, currency = 'usd' } = body
      
      // Fake Stripe payment intent
      const paymentIntent = {
        id: `pi_fake_${uuidv4()}`,
        client_secret: `pi_fake_${uuidv4()}_secret`,
        amount,
        currency,
        status: 'requires_payment_method'
      }
      
      console.log('Fake Stripe payment intent created:', paymentIntent.id)
      return NextResponse.json({ success: true, data: paymentIntent })
    }

    if (path === 'stripe/confirm-payment') {
      const { paymentIntentId } = body
      
      // Fake payment confirmation
      console.log('Fake Stripe payment confirmed:', paymentIntentId)
      
      // Update invoice status
      await db.collection('invoices').updateOne(
        { paymentIntentId },
        { $set: { status: 'paid', paidAt: new Date() } }
      )
      
      return NextResponse.json({ success: true, message: 'Payment confirmed' })
    }

    // PayPal payment endpoints (with fake processing)
    if (path === 'paypal/create-order') {
      const { amount, invoiceId } = body
      
      const orderId = `paypal_fake_${uuidv4()}`
      console.log('Fake PayPal order created:', orderId)
      
      return NextResponse.json({ success: true, orderId })
    }

    if (path === 'paypal/capture-order') {
      const { orderId, invoiceId } = body
      
      console.log('Fake PayPal order captured:', orderId)
      
      // Update invoice status
      await db.collection('invoices').updateOne(
        { id: invoiceId },
        { $set: { status: 'paid', paidAt: new Date(), paypalOrderId: orderId } }
      )
      
      return NextResponse.json({ success: true, message: 'Payment captured' })
    }

    // Email notification endpoints (with fake sending)
    if (path === 'send-email') {
      const { to, subject, type, data } = body
      
      console.log('Fake email sent:', { to, subject, type })
      
      // Log email to database
      const emailLog = {
        id: uuidv4(),
        to,
        subject,
        type,
        data,
        sentAt: new Date(),
        status: 'sent'
      }
      await db.collection('emailLogs').insertOne(emailLog)
      
      return NextResponse.json({ success: true, message: 'Email sent successfully' })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })

  } catch (error) {
    console.error('POST Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// PUT handler
export async function PUT(request, { params }) {
  try {
    const db = await connectDB()
    const path = params.path?.join('/') || ''
    const body = await request.json()

    console.log('PUT request to:', path, 'with body:', body)

    if (path.startsWith('projects/')) {
      const projectId = path.split('/')[1]
      const updateData = { ...body, updatedAt: new Date() }
      delete updateData.id // Don't update the ID
      
      const result = await db.collection('projects').updateOne(
        { id: projectId },
        { $set: updateData }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, message: 'Project updated' })
    }

    if (path.startsWith('sessions/')) {
      const sessionId = path.split('/')[1]
      const updateData = { ...body, updatedAt: new Date() }
      delete updateData.id
      
      const result = await db.collection('sessions').updateOne(
        { id: sessionId },
        { $set: updateData }
      )
      
      if (result.matchedCount === 0) {
        return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, message: 'Session updated' })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })

  } catch (error) {
    console.error('PUT Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// DELETE handler
export async function DELETE(request, { params }) {
  try {
    const db = await connectDB()
    const path = params.path?.join('/') || ''

    console.log('DELETE request to:', path)

    if (path.startsWith('projects/')) {
      const projectId = path.split('/')[1]
      const result = await db.collection('projects').deleteOne({ id: projectId })
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
      }
      
      // Also delete related data
      await db.collection('audioFiles').deleteMany({ projectId })
      await db.collection('comments').deleteMany({ projectId })
      await db.collection('messages').deleteMany({ projectId })
      
      return NextResponse.json({ success: true, message: 'Project deleted' })
    }

    if (path.startsWith('sessions/')) {
      const sessionId = path.split('/')[1]
      const result = await db.collection('sessions').deleteOne({ id: sessionId })
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 })
      }
      
      return NextResponse.json({ success: true, message: 'Session deleted' })
    }

    if (path.startsWith('audio-files/')) {
      const fileId = path.split('/')[1]
      const result = await db.collection('audioFiles').deleteOne({ id: fileId })
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 })
      }
      
      // Delete related comments
      await db.collection('comments').deleteMany({ fileId })
      
      return NextResponse.json({ success: true, message: 'File deleted' })
    }

    return NextResponse.json({ success: false, error: 'Endpoint not found' }, { status: 404 })

  } catch (error) {
    console.error('DELETE Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}