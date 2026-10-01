const router = require('express').Router()
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id)
    next()
  } catch (error) {
    next(error)
  }
}

// GET /api/blogs - list all blogs
router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

// POST /api/blogs - add a new blog
router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user) {
      return res.status(401).json({ error: 'user not found' })
    }
    const { user_id, ...blogData } = req.body
    const blog = await Blog.create({ ...blogData, userId: user.id })
    res.json(blog)
  } catch (error) {
    next(error)
  }
})

// GET /api/blogs/:id - find a single blog
router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

// DELETE /api/blogs/:id - delete a blog
router.delete('/:id', blogFinder, async (req, res, next) => {
  try {
    if (req.blog) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// PUT /api/blogs/:id - update a blog's likes
router.put('/:id', blogFinder, async (req, res, next) => {
  try {
    if (!req.blog) {
      return res.status(404).end()
    }
    if (req.body.likes === undefined || isNaN(Number(req.body.likes))) {
      const error = new Error('likes must be a valid number')
      error.name = 'SequelizeValidationError'
      return next(error)
    }
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    next(error)
  }
})

module.exports = router
