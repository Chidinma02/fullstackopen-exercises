const router = require('express').Router()
const { Op } = require('sequelize')
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

router.get('/', async (req, res, next) => {
  try {
    let where = {}

    if (req.query.search) {
      where = {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${req.query.search}%`
            }
          },
          {
            author: {
              [Op.iLike]: `%${req.query.search}%`
            }
          }
        ]
      }
    }

    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [
        ['likes', 'DESC']
      ]
    })
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

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

router.get('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
  try {
    if (!req.blog) {
      return res.status(404).end()
    }

    const user = await User.findByPk(req.decodedToken.id)
    if (!user || Number(req.blog.userId) !== Number(user.id)) {
      return res.status(401).json({ error: 'only the creator can delete a blog' })
    }

    await req.blog.destroy()
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

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
