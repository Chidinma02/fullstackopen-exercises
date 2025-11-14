const { test } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

test('total likes of a list with one blog equals the likes of that blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const result = listHelper.totalLikes(listWithOneBlog)
  assert.strictEqual(result, 5)
})

test('returns the blog with the most likes', () => {
  const blogs = [
    { title: 'A', author: 'John', likes: 4 },
    { title: 'B', author: 'Jane', likes: 7 },
    { title: 'C', author: 'Doe', likes: 3 }
  ]
  const result = listHelper.favoriteBlog(blogs)
  assert.deepStrictEqual(result, { title: 'B', author: 'Jane', likes: 7 })
})

test('returns the author with the most blogs', () => {
  const blogs = [
    { author: 'Alice', likes: 2 },
    { author: 'Bob', likes: 3 },
    { author: 'Alice', likes: 1 }
  ]
  const result = listHelper.mostBlogs(blogs)
  assert.deepStrictEqual(result, { author: 'Alice', blogs: 2 })
})

test('returns the author with the most total likes', () => {
  const blogs = [
    { author: 'Alice', likes: 5 },
    { author: 'Bob', likes: 8 },
    { author: 'Alice', likes: 7 }
  ]
  const result = listHelper.mostLikes(blogs)
  assert.deepStrictEqual(result, { author: 'Alice', likes: 12 })
})
