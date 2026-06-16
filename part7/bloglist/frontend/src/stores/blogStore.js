import { create } from 'zustand'
import blogService from '../services/blogs'

export const useBlogStore = create((set, get) => ({
  blogs: [],
  fetchBlogs: async () => {
    try {
      const blogs = await blogService.getAll()
      set({ blogs })
    } catch (error) {
      console.error('Error fetching blogs:', error)
    }
  },
  createBlog: async (blogObject) => {
    const newBlog = await blogService.create(blogObject)
    set({ blogs: get().blogs.concat(newBlog) })
    return newBlog
  },
  likeBlog: async (blog) => {
    const updatedBlogData = {
      user: blog.user ? blog.user.id : null,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlogData)
    const updatedBlog = { ...returnedBlog, user: returnedBlog.user || blog.user }
    set({ blogs: get().blogs.map((b) => (b.id === blog.id ? updatedBlog : b)) })
  },
  deleteBlog: async (id) => {
    await blogService.remove(id)
    set({ blogs: get().blogs.filter((b) => b.id !== id) })
  },
  addComment: async (id, comment) => {
    const updatedBlog = await blogService.addComment(id, comment)
    set({ blogs: get().blogs.map((b) => (b.id === id ? updatedBlog : b)) })
  }
}))
