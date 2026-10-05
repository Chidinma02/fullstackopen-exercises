const router = require('express').Router()
const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const { blogId, userId } = req.body
    if (!blogId || !userId) {
      return res.status(400).json({ error: 'blogId and userId are required' })
    }

    const readingList = await ReadingList.create({ blogId, userId })
    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if (!user) {
      return res.status(401).json({ error: 'user not found' })
    }

    const readingList = await ReadingList.findByPk(req.params.id)
    if (!readingList) {
      return res.status(404).json({ error: 'reading list entry not found' })
    }

    if (readingList.userId !== user.id) {
      return res.status(401).json({ error: 'only the owner can modify this reading list entry' })
    }

    if (req.body.read !== undefined) {
      readingList.read = req.body.read
      await readingList.save()
    }

    res.json(readingList)
  } catch (error) {
    next(error)
  }
})

module.exports = router
