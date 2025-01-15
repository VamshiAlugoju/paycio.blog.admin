import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  UseFormRegisterReturn,
  FieldError,
} from "react-hook-form";

import Dropdown from "../components/DropDown";

import Editor from "../components/Editor";
import apiClient from "../api/apiClient";
import { blogRoutes } from "../api/urls";
import Button from "../components/ui/Button";
import TagItem from "../components/ui/TagItem";
 import FormInput from "./FormInput";
import { BlogPost } from "../pages/Blogs";
import { cn } from "../lib/utils/cn";
import ImgUploadSection from "./ImgUploadSection";

export type category = {
  name: string;
};

type BlogData = {
  blog: BlogPost;
  categories: category[];
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  setBlog: React.Dispatch<React.SetStateAction<BlogPost | null>>;
};

function UpdateSection({
  blog,
  categories,
  isEditable,
  setIsEditable,
  setBlog
}: BlogData) {
  const blogInitialData: BlogPost = {
    _id: blog._id,
    title: blog.title,
    description: blog.description,
    body: blog.body,
    slug: blog.slug,
    author: blog.author,
    meta_title: blog.meta_title,
    meta_desc: blog.meta_desc,
    meta_keywords: blog.meta_keywords,
    category: blog.category,
    tags: blog.tags,
    featured_img: blog.featured_img,
    og_image: blog.og_image,
    og_title: blog.og_title,
    og_description: blog.og_description,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
   
  };

  const [newCategory, setNewCateogory] = useState("");
  const [tags, setTags] = useState<string[]>(blog.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [content, setContent] = useState<string>(blog.body);
  const [selectedCategory, setSelctedCategory] = useState(blog.category);

  function setFieldValue(fieldName: string, value: string) {
    setContent(value);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlogPost>({ defaultValues: blogInitialData });

  function removeTags(idx: number) {
    console.log("cliekce");
    setTags((prev) => {
      return prev.filter((tag, index) => index !== idx);
    });
  }

  function addTag(tag: string) {
    setTags((prev) => [...prev, tag]);
    setTagInput("");
  }

  const onSubmit = async (data: BlogPost) => {
    try {
      const updateBlogPayload = {
        title: data.title,
        description: data.description,
        body: content,
        slug: data.slug,
        author: "John Doe",
        meta_title: data.meta_title,
        meta_desc: data.meta_desc,
        meta_keywords:  data.meta_keywords ,
        category: selectedCategory,
        tags: tags,
        featured_img: data.featured_img,
        og_image: data.og_image,
        og_title: data.og_title,
        og_description: data.og_description,
      };
      const response = await apiClient.post(
        blogRoutes.updateBlog + data.slug,
        updateBlogPayload
      );
      if (!response.status) {
        alert(response.message);
        return;
      }
     
      setBlog(response.blog);
      setIsEditable(false);
      alert("updated blog successfully");
    } catch (err) {
      console.log(err);
    }
  };
 

  async function addCategory() {
    try {
      if (newCategory.trim() != "") {
        const response = await apiClient.post(blogRoutes.createCategory, {
          name: newCategory,
        });

        if(response.status === false){
          alert(response.error);
          return;
        }
        alert("category added successfully");
      }
    } catch (err) {
      console.log(err);
    }
  }

    useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isEditable) return; // Ensure it only triggers when `isEditable` is true
      event.preventDefault();
      event.returnValue = " Are you sure you want to leave?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isEditable]);


  return (
    <div className="w-[90%] flex flex-col items-center ">
      {/* blog details section  */}
      <div className=" w-full flex justify-around  ">
        {/* left section  */}
        <div className="flex flex-col gap-2 flex-grow ">
          <h3> Blog Details: </h3>
          {/* title  */}
          <div className="flex gap-4 items-center">
            <FormInput
              id="title"
              label="Title:"
              placeholder="Enter blog title"
              register={register("title", { required: "Title is required" })}
              error={errors.title}
              disabled={!isEditable}
            />
            <FormInput
              id="featured_img"
              label="Featured Image:"
              placeholder="Enter Feature Image Url"
              register={register("featured_img", {
                required: "Image url is required",
              })}
              error={errors.featured_img}
              disabled={!isEditable}
            />
          </div>
          <div className="flex items-start gap-4">
    
            <FormInput
              id="slug"
              label="Slug:"
              placeholder="Enter  slug"
              register={register("slug", { required: "slug is required" })}
              error={errors.slug}
              className="mb-0"
              disabled={!isEditable}
            />
          </div>

          {/* categories list  */}
          <div className="flex items-center gap-4 my-2 ">
            <div className="mt-2">
              <label className="" htmlFor="">
                {" "}
                Categories :{" "}
              </label>
              <Dropdown
                onSelect={(option) => {
                  setSelctedCategory(option);
                }}
                options={categories.map((items) => items.name)}
              />
            </div>

            {/* // add category  */}
            <div className="flex items-center gap-2 ">
              <input
                type=""
                className="border p-1 rounded-md "
                placeholder="category name"
                value={newCategory}
                onChange={(e) => {
                  setNewCateogory(e.target.value);
                }}
              />
              <button
                disabled={!isEditable || newCategory.length === 0}
                className={cn(
                  "bg-black text-white p-1 px-2 outline-none border border-black rounded-md ",
                  { "cursor-pointer": isEditable }
                )}
                onClick={addCategory}
              >
                {" "}
                Add category{" "}
              </button>
            </div>
          </div>

          {/* tags  */}
          <div className="flex flex-col gap-3 mt-4 ">
            <div className=" flex gap-2">
              <label htmlFor="tags">Tags:</label>
              <input
                disabled={!isEditable}
                id="tags"
                value={tagInput}
                className="border rounded-md  p-1"
                placeholder="Enter tag names"
                onChange={(e) => {
                  setTagInput(e.target.value);
                }}
              />
              <Button
                className=" py-1 text-sm px-4 bg-black text-white "
                disabled={!isEditable}
                onClick={() => addTag(tagInput)}
              >
                Add
              </Button>
            </div>

            {/* tag list  */}
            <div className="flex items-center max-w-72 flex-wrap gap-1 ">
              {tags.length === 0 ? (
                <p className="m-0 text-sm "> No tags added </p>
              ) : (
                <>
                  {tags.map((tag, idx) => (
                    <TagItem
                      key={idx}
                      tagName={tag}
                      onRemove={() => removeTags(idx)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="my-4">
            <h3> Meta data: </h3>
            <div className="flex gap-4 items-center  my-4 ">
              <FormInput
                id="metaTitle"
                label="Meta-Title:"
                placeholder=" Enter meta title"
                register={register("meta_title", {
                  required: "MetaTitle is required",
                })}
                error={errors.meta_title}
                disabled={!isEditable}
              />

              <FormInput
                id="metaDescription"
                label="Meta-Description:"
                placeholder=" Enter meta description"
                register={register("meta_desc", {
                  required: "MetaDescription is required",
                  minLength: {
                    value: 10,
                    message:
                      "og_description must be at least 10 characters long",
                  },
                })}
                error={errors.meta_desc}
                disabled={!isEditable}
              />
            </div>
            <div className="flex gap-4 items-center flex-wrap  ">
              <FormInput
                id="og_title"
                label="og_title:"
                placeholder="Enter og_title"
                register={register("og_title", {
                  required: "og_title is required",
                })}
                error={errors.og_title}
                disabled={!isEditable}
              />
              <FormInput
                id="og_description"
                label="og_description:"
                placeholder="Enter og_description"
                register={register("og_description", {
                  required: "og_description is required",
                  minLength: {
                    value: 10,
                    message:
                      "og_description must be at least 10 characters long",
                  },
                })}
                error={errors.og_description}
                disabled={!isEditable}
              />
              <FormInput
                id="og_url"
                label="og_url:"
                placeholder="Enter og_url"
                register={register("og_image", {
                  required: "og_image is required",
                })}
                error={errors.og_image}
                disabled={!isEditable}
              />
            </div>
          </div>
        </div>

        {/* right section  */}
        <div>
         <ImgUploadSection />
        </div>
      </div>

      {/* blog editor section  */}
      <div className="  w-full ">
        <h3>body:</h3>
        <Editor
          placeholder=""
          setFieldValue={setFieldValue}
          initialContent={blog.body}
          editable={!isEditable}
        />
      </div>

      <div className="mt-4">
        {!isEditable && (
          <Button
            onClick={() => setIsEditable(!isEditable)}
            className="bg-black p-4 py-2 rounded-md  text-white "
          >
            Edit
          </Button>
        )}

        {isEditable && (
          <div className=" flex items-center gap-2">
            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-green-400 p-4 py-2 rounded-md  text-black border-none "
            >
              Submit
            </Button>
            <Button
              onClick={() => setIsEditable(!isEditable)}
              className="bg-red-400 p-4 py-2 rounded-md   text-black border-none "
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="h-12"></div>
    </div>
  );
}

export default UpdateSection;
