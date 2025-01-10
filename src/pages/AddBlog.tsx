import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  UseFormRegisterReturn,
  FieldError,
} from "react-hook-form";
import { cn } from "../lib/utils/cn";
import Dropdown from "../components/DropDown";
import { X } from "lucide-react";
import Editor from "../components/Editor";
import apiClient from "../api/apiClient";
import { API_URL, blogRoutes } from "../api/urls";
import Button from "../components/ui/Button";
import TagItem from "../components/ui/TagItem";

type BlogFormData = {
  slug: string;
  title: string;
  description: string;
  featuredImage: string;
  body: string;
  category: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  og_url: string;
  og_title: string;
  og_description: string;
};

export type category = {
  name: string;
};

function AddBlog() {
  const [categories, setCategories] = useState<category[]>([]);

  const [newCategory, setNewCateogory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [selectedCategory, setSelctedCategory] = useState("");

  function setFieldValue(fieldName: string, value: string) {
    setContent(value);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlogFormData>();

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

  const onSubmit = async (data: BlogFormData) => {
   
    try{

      if (selectedCategory === "") {
        alert("select category");
        return;
      }
  
      const createBlogPayload = {
        title: data.title,
        description: data.metaDescription,
        body: content,
        slug: data.slug,
        author: "John Doe",
        meta_title: data.metaTitle,
        meta_desc: data.metaDescription,
        meta_keywords: "blog, first post, my blog",
        category: selectedCategory,
        tags: tags,
        featured_img: "https://example.com/images/featured.jpg",
        og_image: "https://example.com/images/featured.jpg",
        og_title: data.og_title,
        og_description: data.og_description,
      };
  
      const response = await apiClient.post(
        blogRoutes.createBlog,
        createBlogPayload
      );
       if(response && response.status===false){
        alert(response.error)
       }
  
      // reset(); // Clear the form after submission
    }catch(err){
      console.log(err)
    }
  };

  function uploadImage() {
    if (selectedImage) {
      // upload to cloud
      console.log("came here");
    }
  }

  useEffect(() => {
    (async () => {
      await getCategories();
    })();
  }, []);

  async function addCategory() {
    try {
      if (newCategory.trim() != "") {
        const response = await apiClient.post(blogRoutes.createCategory, {
          name: newCategory,
        });
        console.log(response);
        getCategories();
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getCategories() {
    try {
      const response = await apiClient.get(blogRoutes.getAllCategories);
      console.log(response.categories, "cat ?>>>>");
      setCategories(response.categories);
    } catch (err) {
      console.log(err);
    }
  }

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
            />
            <FormInput
              id="featuredImage"
              label="Featured Image:"
              placeholder="Enter Feature Image Url"
              register={register("featuredImage", {
                required: "Image url is required",
              })}
              error={errors.featuredImage}
            />
          </div>
          <div className="flex items-start gap-4">
            <div>
              <label className="text-gray-600 dark:text-gray-400">
                Description
              </label>
              <textarea
                className=" block w-80 py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100   "
                {...register("description", {
                  required: "Description is required",
                   minLength: {
                    value: 10,
                    message:
                      "og_description must be at least 10 characters long",
                  },
                })}
                placeholder="Enter blog description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <FormInput
              id="slug"
              label="Slug:"
              placeholder="Enter  slug"
              register={register("slug", { required: "slug is required" })}
              error={errors.slug}
              className="mb-0"
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
                disabled={newCategory.length === 0}
                className="bg-black text-white p-1 px-2 outline-none border border-black rounded-md cursor-pointer "
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
                register={register("metaTitle", {
                  required: "MetaTitle is required",
                })}
                error={errors.metaTitle}
              />

              <FormInput
                id="metaDescription"
                label="Meta-Description:"
                placeholder=" Enter meta description"
                register={register("metaDescription", {
                  required: "MetaDescription is required",
                   minLength: {
                    value: 10,
                    message:
                      "og_description must be at least 10 characters long",
                  },  
                })}
                error={errors.metaDescription}
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
              />
              <FormInput
                id="og_url"
                label="og_url:"
                placeholder="Enter og_url"
                register={register("og_url", {
                  required: "og_url is required",
                })}
                error={errors.og_url}
              />
            </div>
          </div>
        </div>

        {/* right section  */}
        <div>
          <div className="flex flex-col gap-2">
            <div>
              <label htmlFor="featuredImage"> Upload Image </label>
              <input
                id="uploadImg"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedImage(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div>
              <Button onClick={uploadImage}>Upload Image</Button>
            </div>
            <div className="flex items-center gap-2 ">
              <p>Image Url</p>
              <input type="text" className="max-h-5" contentEditable={false} />
            </div>
          </div>
        </div>
      </div>

      {/* blog editor section  */}
      <div className="  w-full ">
        <h3>body:</h3>
        <Editor placeholder="" setFieldValue={setFieldValue} />
      </div>
      <div>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-black p-4 py-2 rounded-md mt-4 text-white "
        >
          Submit
        </Button>
      </div>
      <div className="h-12"></div>
    </div>
  );
}

export default AddBlog;

 export  interface FormInputProps {
  id: string;
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  className?: string;
  disabled?:boolean
}

 export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  placeholder,
  register,
  error,
  className,
  disabled
}) => {
  return (
    <div className={cn("mb-4", className)}>
      <label className="text-gray-600 dark:text-gray-400" htmlFor={id}>
        {label}
      </label>
      <input
      disabled={disabled}
        id={id}
        className={`block w-80 py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100 ${
          error ? "border-red-500" : ""
        }`}
        {...register}
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};



