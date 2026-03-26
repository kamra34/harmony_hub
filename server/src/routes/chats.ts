import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const createConversationSchema = z.object({
  title: z.string().max(200).default('New conversation'),
})

const addMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  hasImage: z.boolean().default(false),
})

const updateTitleSchema = z.object({
  title: z.string().max(200),
})

export function chatRouter(prisma: PrismaClient): Router {
  const router = Router()

  // GET /api/chats — list all conversations for the user (no messages, just metadata)
  router.get('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const conversations = await prisma.chatConversation.findMany({
        where: { userId: req.userId! },
        orderBy: { updatedAt: 'desc' },
        take: 50,
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { messages: true } },
        },
      })

      res.json({ conversations })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })

  // POST /api/chats — create a new conversation
  router.post('/', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const data = createConversationSchema.parse(req.body)

      const conversation = await prisma.chatConversation.create({
        data: {
          userId: req.userId!,
          title: data.title,
        },
      })

      res.status(201).json({ conversation })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })

  // GET /api/chats/:id — get a conversation with all messages
  router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const conversation = await prisma.chatConversation.findFirst({
        where: { id: req.params.id as string, userId: req.userId! },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      })

      if (!conversation) {
        res.status(404).json({ error: 'Conversation not found' })
        return
      }

      res.json({ conversation })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })

  // PATCH /api/chats/:id — update conversation title
  router.patch('/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const data = updateTitleSchema.parse(req.body)

      const conversation = await prisma.chatConversation.updateMany({
        where: { id: req.params.id as string, userId: req.userId! },
        data: { title: data.title },
      })

      if (conversation.count === 0) {
        res.status(404).json({ error: 'Conversation not found' })
        return
      }

      res.json({ updated: true })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })

  // DELETE /api/chats/:id — delete a conversation and all its messages
  router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const result = await prisma.chatConversation.deleteMany({
        where: { id: req.params.id as string, userId: req.userId! },
      })

      if (result.count === 0) {
        res.status(404).json({ error: 'Conversation not found' })
        return
      }

      res.json({ deleted: true })
    } catch (err: any) {
      res.status(500).json({ error: err.message })
    }
  })

  // POST /api/chats/:id/messages — add a message to a conversation
  router.post('/:id/messages', authenticateToken, async (req: AuthRequest, res) => {
    try {
      const data = addMessageSchema.parse(req.body)

      // Verify ownership
      const conv = await prisma.chatConversation.findFirst({
        where: { id: req.params.id as string, userId: req.userId! },
      })
      if (!conv) {
        res.status(404).json({ error: 'Conversation not found' })
        return
      }

      const message = await prisma.chatMessage.create({
        data: {
          conversationId: req.params.id as string,
          role: data.role,
          content: data.content,
          hasImage: data.hasImage,
        },
      })

      // Touch the conversation's updatedAt
      await prisma.chatConversation.update({
        where: { id: req.params.id as string },
        data: { updatedAt: new Date() },
      })

      res.status(201).json({ message })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  })

  return router
}
