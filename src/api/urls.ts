import env from "../env-var/env";

export const API_URL = env.api.baseUrl


 export  const blogRoutes = {
  getBlogBySlug: "/v1/blogs/",
  getAllBlogs: "/v1/blogs",
  getAllCategories: "/v1/categories",
  getBlogsByCategory: "/v1/c-blogs/",

  createBlog: "/v1/post-blog",
  createCategory: "/v1/add-category",
  updateBlog: "/v1/update-blog/",
  updateCategory: "/v1/update-category/:category_name",
  uploadImage : "/v1/upload"
};

    