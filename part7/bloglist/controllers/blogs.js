const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

// blogsRouter.post('/',async(req,res)=>{
//     const blog = new Blog(req.body)
//     const savedBlog = await blog.save();
//     res.status(201).json(savedBlog)
// })

blogsRouter.post('/', async (req, res) => {
  const body = req.body
  const user = req.user

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user ? user._id : undefined
  })

  const savedBlog = await blog.save()

  if (user) {
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
  }

  const populatedBlog = user
    ? await savedBlog.populate('user', { username: 1, name: 1 })
    : savedBlog
  res.status(201).json(populatedBlog)
})

// DELETE a blog by ID
blogsRouter.delete('/:id', async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  // If the blog was added by a user, check ownership
  if (blog.user && (!user || blog.user.toString() !== user._id.toString())) {
    return res.status(401).json({ error: 'unauthorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

// UPDATE a blog (e.g., update likes)
blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes, user } = req.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes, user },
    { new: true, runValidators: true, context: 'query' } // ensures validators run
  ).populate('user', { username: 1, name: 1 })

  res.json(updatedBlog)
})

// ADD a comment to a blog
blogsRouter.post('/:id/comments', async (req, res) => {
  const { comment } = req.body

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ error: 'comment content is required' })
  }

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  blog.comments = blog.comments ? blog.comments.concat(comment) : [comment]
  const savedBlog = await blog.save()

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(201).json(populatedBlog)
})

module.exports = blogsRouter
