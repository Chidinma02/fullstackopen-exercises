require('dotenv').config()
const express = require('express')
const { Sequelize, Model, DataTypes } = require('sequelize')

const app = express()
app.use(express.json())

const isLocalhost =
  !process.env.DATABASE_URL ||
  process.env.DATABASE_URL.includes('localhost') ||
  process.env.DATABASE_URL.includes('127.0.0.1')

const dialectOptions = !isLocalhost
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  : {}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions
})

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  }
)

// GET api/blogs - list all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST api/blogs - add a new blog
app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
    res.json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE api/blogs/:id - delete a blog
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      await blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
