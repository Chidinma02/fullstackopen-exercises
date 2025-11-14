const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/',async(req,res)=>{
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


  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })

  
  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

// DELETE a blog by ID
blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

// UPDATE a blog (e.g., update likes)
blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' } // ensures validators run
  )
  res.json(updatedBlog)
})


module.exports = blogsRouter