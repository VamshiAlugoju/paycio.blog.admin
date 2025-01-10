import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import { blogRoutes } from "../api/urls";
import Dropdown from "../components/DropDown";
import Button from "../components/ui/Button";
import { category } from "./AddBlog";
import { useNavigate } from "react-router";

  export interface BlogPost {
  _id: string;
  title: string;
  description: string;
  body: string;
  slug: string;
  author: string;
  meta_title: string;
  meta_desc: string;
  meta_keywords: string;
  category: string;
  tags: string[];
  featured_img: string;
  og_image: string;
  og_title: string;
  og_description: string;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  __v: number;
}

function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const navigate = useNavigate();
  async function getAllBlogs() {
    try {
      const response = await apiClient.get(blogRoutes.getAllBlogs);
      setBlogs(response.blogs);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    try {
      (async () => {
        const categoriesResp = await apiClient.get(blogRoutes.getAllCategories);
        await getAllBlogs();
        setCategories(categoriesResp.categories);
      })();
    } catch (err) {
      console.log(err);
    }
  }, []);

  async function selecteCategory(categoryName: string) {
    if (categoryName === "") {
      await getAllBlogs();
      return;
    }

    try {
      const response = await apiClient.get(
        blogRoutes.getBlogsByCategory + categoryName
      );
      console.log(response);
      setBlogs(response.blogs);
    } catch (err) {
      console.log(err);
    }
  }


  function handleBlogClick( blog : BlogPost){
    navigate(`/blogs/${blog.slug}`)
  }

  return (
    <div className="p-2 w-full">
      <TopSection categories={categories} selecteCategory={selecteCategory} />
      <div>
        <div className="flex flex-col gap-1 justify-center items-center ">
            {blogs.length === 0  && <p className="text-slate-800 text-sm mt-4 " > No Blogs found </p> }
          {blogs.map((blog) => {
            return <BlogItem key={blog.slug} blog={blog} handleBlogClick={handleBlogClick} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Blogs;

type TopSectionProps = {
  categories: category[];
  selecteCategory: (categoryName: string) => void;
};
function TopSection({ categories, selecteCategory }: TopSectionProps) {
  return (
    <div className="flex items-center w-full justify-center bg-slate-50 gap-4 p-2">
      <div className="flex items-center gap-2 ">
        <label className=" text-sm " htmlFor="">
          {" "}
          Categories :{" "}
        </label>
        <select
          className="px-2 py-1 rounded-md"
          onChange={(e) => {
            // console.log(e.target.value)
            selecteCategory(e.target.value);
          }}
        >
          <option value="" selected>
            select category
          </option>
          {categories.map((category) => (
            <option value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <input className=" " type="text" placeholder="search" />
        <Button>Search</Button>
      </div>
    </div>
  );
}

type BlogItemProps = {
  blog: BlogPost;
  handleBlogClick : (blog : BlogPost) => void
};

function BlogItem({ blog , handleBlogClick }: BlogItemProps) {
  return (
    <div
      className="flex gap-4 border border-slate-200 rounded-md p-2  max-w-[80vw] w-full flex-shrink-0 hover:bg-slate-100 cursor-pointer  "
      style={{
        borderColor: "gray",
      }}
      onClick={() => handleBlogClick(blog)}
    >
      <span className=" w-14 h-14 ">
        <img
          src={blog.featured_img}
          alt={blog.title}
          className="h-full w-full rounded-md truncate "
        />
      </span>
      <div className="flex-grow">
        <p className="font-semibold text-black text-sm  "> {blog.title} </p>
        <p className="text-xs text-slate-400 truncate "> {blog.description} </p>
      </div>
    </div>
  );
}
