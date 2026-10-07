export interface Blog {
  id: number;
  title: string;
  author: string;
  url: string;
  likes: number;
}

const initialBlogs: Blog[] = [
  {
    id: 1,
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    id: 2,
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    id: 3,
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    id: 4,
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    id: 5,
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    id: 6,
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  },
];

declare global {
  var __blogs: Blog[] | undefined;
}


if (!globalThis.__blogs) {
  globalThis.__blogs = [...initialBlogs];
}

const blogs: Blog[] = globalThis.__blogs;

export function getBlogs(filter?: string): Blog[] {
  let result = [...blogs];
  if (filter) {
    const term = filter.toLowerCase();
    result = result.filter((b) => b.title.toLowerCase().includes(term));
  }
  return result.sort((a, b) => b.likes - a.likes);
}

export function getBlogById(id: number): Blog | undefined {
  return blogs.find((b) => b.id === id);
}

export function likeBlog(id: number): Blog | undefined {
  const blog = blogs.find((b) => b.id === id);
  if (blog) {
    blog.likes += 1;
  }
  return blog;
}

export function addBlog(blog: { title: string; author: string; url: string }): Blog {
  const newBlog: Blog = {
    ...blog,
    id: blogs.length > 0 ? Math.max(...blogs.map((b) => b.id)) + 1 : 1,
    likes: 0,
  };
  blogs.push(newBlog);
  return newBlog;
}

