//todo : include it in env
export const API_URL = "http://localhost:8000";


 export  const blogRoutes = {
  getBlogBySlug: "/v1/blogs/",
  getAllBlogs: "/v1/blogs",
  getAllCategories: "/v1/categories",
  getBlogsByCategory: "/v1/c-blogs/",

  createBlog: "/v1/post-blog",
  createCategory: "/v1/add-category",
  updateBlog: "/v1/update-blog/:blog_slug",
  updateCategory: "/v1/update-category/:category_name"
};

    