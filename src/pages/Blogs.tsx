import React, { useEffect, useMemo, useRef, useState } from "react";
import apiClient from "../api/apiClient";
import { blogRoutes } from "../api/urls";
import Dropdown from "../components/DropDown";
import Button from "../components/ui/Button";
import { category } from "./AddBlog";
import { useNavigate } from "react-router";
import { Loader } from "../assets/Icons/icons";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { deleteBlog } from "../lib/utils/blog.lib";

import Modal from "../components/utils/Modal";

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
  jsonLd?: string;
  category: string;
  tags: string[];
  featured_img: string;
  og_image: string;
  og_title: string;
  og_description: string;
  status: "active" | "drafted";
  section_ids: string[];
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

function Blogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const value = useDebounce(searchTerm, 300);

  const navigate = useNavigate();
  async function getAllBlogs(params: any = {}) {
    try {
      setLoading(true);
      const response = await apiClient.get(blogRoutes.getAllBlogs, { params });
      if (response.status === false) {
        toast.error("cannot get blogs");
        return;
      }
      setBlogs(response.blogs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function selecteCategory(categoryName: string) {
    if (categoryName === "") {
      await getAllBlogs();
      return;
    }
    try {
      const response = await apiClient.get(blogRoutes.getBlogsByCategory, {
        params: { categories: categoryName },
      });
      if (response && !response.status) {
        toast.error(response.message, {});
        return;
      }
      setBlogs(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  function handleBlogClick(blog: BlogPost) {
    navigate(`/blogs/${blog.slug}`);
  }

  async function handleDeleteBlogclick(blog: BlogPost) {
    try {
      await deleteBlog(blog.slug);
      setBlogs(blogs.filter((b) => b.slug !== blog.slug));
      return Promise.resolve();
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }

  const filteredBlogs = useMemo(() => {
    if (value === "") return blogs;
    return blogs.filter((blog) =>
      blog.title.toLocaleLowerCase().includes(value.toLocaleLowerCase())
    );
  }, [blogs, value]);

  useEffect(() => {
    try {
      (async () => {
        const categoriesResp = await apiClient.get(blogRoutes.getAllCategories);
        if (categoriesResp.status === false) {
          toast.error(categoriesResp.message);
          return;
        }
        await getAllBlogs();
        setCategories(categoriesResp.categories);
      })();
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="p-2 w-full">
      <TopSection
        categories={categories}
        selecteCategory={selecteCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        getAllBlogs={getAllBlogs}
      />
      <div>
        <div className="flex flex-col gap-1 justify-center items-center ">
          {loading ? (
            <Loader className=" h-8 w-8 text-black " fill="#000000" />
          ) : (
            <>
              {filteredBlogs.length === 0 ? (
                <p className="text-slate-800 text-sm mt-4 "> No Blogs found </p>
              ) : (
                <>
                  {filteredBlogs.map((blog) => {
                    return (
                      <BlogItem
                        key={blog.slug}
                        blog={blog}
                        handleBlogClick={handleBlogClick}
                        handleDeleteBlog={handleDeleteBlogclick}
                      />
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;

type TopSectionProps = {
  categories: category[];
  selecteCategory: (categoryName: string) => void;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  getAllBlogs(params?: any): Promise<void>;
};
function TopSection({
  categories,
  selecteCategory,
  setSearchTerm,
  searchTerm,
  getAllBlogs,
}: TopSectionProps) {
  const [showDrafts, setShowDrafts] = useState(false);
  return (
    <div className="flex items-center w-full justify-center bg-slate-50 gap-4 p-2  max-w-[80vw] mx-auto my-2 rounded-md ">
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
            All
          </option>
          {categories.map((category) => (
            <option value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <input
          className=" "
          value={searchTerm}
          type="text"
          placeholder="Search by title"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <Button>Search</Button>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Switch
          checked={showDrafts}
          onChange={(checked) => {
            setShowDrafts(checked);
            if (checked) {
              getAllBlogs({ blog_status: "drafted" });
            } else {
              getAllBlogs();
            }
          }}
        />
        <p className="text-sm font-semibold ">Show Drafts</p>
      </div>
    </div>
  );
}

type BlogItemProps = {
  blog: BlogPost;
  handleBlogClick: (blog: BlogPost) => void;
  handleDeleteBlog: (blog: BlogPost) => Promise<void>;
};

function BlogItem({ blog, handleBlogClick, handleDeleteBlog }: BlogItemProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div
      className="flex gap-4 border border-slate-200 rounded-md p-2  max-w-[80vw] w-full flex-shrink-0 hover:bg-slate-100 cursor-pointer group "
      style={{
        borderColor: "gray",
      }}
      onClick={() => handleBlogClick(blog)}
    >
      <span className=" w-14 h-14 flex-shrink-0 ">
        <img
          src={blog.featured_img}
          alt={blog.title}
          className="h-full w-full rounded-md truncate object-cover "
        />
      </span>
      <div className="flex-grow max-w-[70%]  ">
        <p className="font-semibold text-black text-sm truncate ">
          {" "}
          {blog.title}{" "}
        </p>
        <p className="text-xs text-slate-400 truncate w-[90%] ">
          {" "}
          {blog.meta_desc}{" "}
        </p>
      </div>
      <div
        className="place-content-end ml-auto  items-center flex  flex-shrink-0 "
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className=" p-2 rounded-full  border-none hover:bg-slate-300  flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100  "
        >
          <Trash2 size={16} color="red" />
        </button>
      </div>
      {showModal && (
        <>
          <Modal open={showModal}>
            <div className="max-w-[20rem bg-white rounded-md p-4 flex flex-col gap-6 ">
              <p className="font-semibold text-lg  ">
                {" "}
                Are you sure you want to delete this blog?{" "}
              </p>
              <div className="flex justify-end gap-2 items-center">
                <button
                  className=" border border-black  p-1  px-4  rounded-md text-lg cursor-pointer hover:bg-slate-100  "
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(false);
                  }}
                >
                  {" "}
                  Cancel{" "}
                </button>
                <button
                  className="bg-red-300 text-red-500 border-none p-1  px-4  rounded-md text-lg cursor-pointer hover:border hover:border-black hover:bg-red-400 hover:text-black "
                  onClick={async (e) => {
                    try {
                      setLoading(true);
                      e.stopPropagation();
                      await handleDeleteBlog(blog);
                      setLoading(false);
                      setShowModal(false);
                    } catch (err) {
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? (
                    <Loader className=" h-8 w-8 text-black " fill="#000000" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Clear timeout on cleanup or value change
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch = ({ checked, onChange }: SwitchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalChecked, setInternalChecked] = useState(checked);

  const handleToggle = () => {
    if (inputRef.current) {
      const isChecked = !inputRef.current.checked;
      inputRef.current.checked = isChecked; // Sync with input
      setInternalChecked(isChecked); // Update internal state
      onChange(isChecked); // Notify parent
    }
  };

  return (
    <div className="relative inline-flex items-center cursor-pointer ">
      <input
        type="checkbox"
        ref={inputRef}
        checked={internalChecked}
        onChange={(e) => {
          const isChecked = e.target.checked;
          setInternalChecked(isChecked);
        }}
        className="sr-only"
      />
      <button
        type="button"
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 border-none cursor-pointer ${
          internalChecked ? "bg-black" : "bg-gray-300"
        }`}
        aria-checked={internalChecked}
      >
        <span
          className={`absolute h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
            internalChecked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};
