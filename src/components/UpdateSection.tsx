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
import { toast } from "react-toastify";
import { addSubCategoryApi, updateBlog } from "../lib/utils/blog.lib";

export type category = {
  name: string;
  sub_categories: string[];
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
  setBlog,
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
    sub_category: blog.sub_category,
    tags: blog.tags,
    featured_img: blog.featured_img,
    og_image: blog.og_image,
    og_title: blog.og_title,
    status: blog.status,
    og_description: blog.og_description,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    section_ids: blog.section_ids,
    jsonLd: blog.jsonLd,
  };

  const [newCategory, setNewCateogory] = useState("");
  const [tags, setTags] = useState<string[]>(blog.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState<string>(blog.body);
  const [selectedCategory, setSelctedCategory] = useState<category | null>(
    categories.find((category) => category.name === blog.category) || null
  );
  const [tabelOfContents, setTableOfcontents] = useState<string[]>(
    blog.section_ids || []
  );
  const [subCategoryState, setSubCategoriesState] = useState({
    selectedSubCategory: blog.sub_category,
    subCategories: [],
    newSubCategory: "",
  });

  function setFieldValue(fieldName: string, value: string) {
    setContent(value);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BlogPost>({ defaultValues: blogInitialData });

  function removeTags(idx: number) {
    if (!isEditable) return;
    setTags((prev) => {
      return prev.filter((tag, index) => index !== idx);
    });
  }

  function removeTableOfContent(idx: number) {
    if (!isEditable) return;
    setTableOfcontents((prev) => {
      return prev.filter((tag, index) => index !== idx);
    });
  }

  function addTag(tag: string) {
    setTags((prev) => [...prev, tag]);
    setTagInput("");
  }

  const onSubmit = async (data: BlogPost) => {
    try {
      const { _id, createdAt, updatedAt, ...rest } = data;

      const updateBlogPayload = {
        ...rest,
        body: content,
        author: "John Doe",
        tags: tags,
        section_ids: tabelOfContents,
      };

      const response = await updateBlog(updateBlogPayload, data._id);

      setBlog(response.blog);
      setIsEditable(false);
    } catch (err) {
      console.log(err);
    }
  };

  function addTableOfContent(id: string) {
    setTableOfcontents((prev) => [...prev, id]);
  }

  async function addCategory() {
    try {
      if (newCategory.trim() != "") {
        const response = await apiClient.post(blogRoutes.createCategory, {
          name: newCategory,
        });

        if (response.status === false) {
          toast.error(response.error);
          return;
        }
        toast.success("category added successfully");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function addSubCategory() {
    if (!subCategoryState.selectedSubCategory) {
      toast.error("sub category couldn't be empty");
      return;
    }
    if (!selectedCategory) {
      toast.error("category couldn't be empty");
      return;
    }
    await addSubCategoryApi(
      selectedCategory?.name,
      subCategoryState.selectedSubCategory
    );
    setSubCategoriesState((prev) => ({ ...prev, newSubCategory: "" }));
  }

  useEffect(() => {
    setSelctedCategory(
      categories.find((category) => category.name === blog.category) || null
    );
  }, [categories]);

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
            <div className="w-80   p-2 px-3 ">
              <p className=" m-0 p-0 ">Table of Contents :</p>
              <div className="flex items-center max-w-72 flex-wrap gap-1 ">
                {tabelOfContents.length === 0 ? (
                  <p className="m-0 text-xs "> No table of Contents</p>
                ) : (
                  <>
                    {tabelOfContents.map((content, idx) => (
                      <TagItem
                        key={idx}
                        tagName={content}
                        onRemove={() => removeTableOfContent(idx)}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>
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
          <div className="items-center gap-4 my-2 hidden">
            <div className="mt-2">
              <label className="" htmlFor="">
                {" "}
                Categories :{" "}
              </label>
              <Dropdown
                onSelect={(option) => {
                  const category = categories.find(
                    (val) => val.name === option
                  );
                  if (category) {
                    setSelctedCategory(category);
                    setSubCategoriesState((prev) => ({
                      ...prev,
                      selectedSubCategory: "",
                    }));
                  }
                }}
                options={categories.map((items) => items.name)}
                disabled={!isEditable}
                defaultOption={blog.category}
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
                disabled={!isEditable}
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
          <div className="items-center gap-4 my-2 hidden">
            <div className="mt-2 w-80 px-3 ">
              <label className="" htmlFor="">
                {" "}
                Sub Category :{" "}
              </label>
              <Dropdown
                onSelect={(option) => {
                  setSubCategoriesState((prev) => ({
                    ...prev,
                    selectedSubCategory: option,
                  }));
                }}
                options={
                  selectedCategory?.sub_categories.map((items) => items) || []
                }
                defaultOption={subCategoryState.selectedSubCategory}
                disabled={!isEditable}
              />
            </div>

            {/* // add sub cateogory  */}
            <div className="flex items-center gap-2 ">
              <input
                type=""
                className="border p-1 rounded-md "
                placeholder="Sub Category"
                value={subCategoryState.newSubCategory}
                onChange={(e) => {
                  setSubCategoriesState((prev) => ({
                    ...prev,
                    newSubCategory: e.target.value,
                  }));
                }}
              />
              <button
                disabled={newCategory.length === 0}
                className="bg-black text-white p-1 px-2 outline-none border border-black rounded-md cursor-pointer "
                onClick={addSubCategory}
              >
                {" "}
                Add SubCategory{" "}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTag(tagInput);
                  }
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
              <div className=" flex gap-2">
                <div>
                  <label className="text-gray-600 dark:text-gray-400">
                    Meta Keywords:
                  </label>
                  <textarea
                    className=" block w-80 max-w-52 py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100  no-scrollbar "
                    {...register("meta_keywords", {
                      required: "metaKeywords is required",
                    })}
                    placeholder="Enter meta keywords"
                    disabled={!isEditable}
                  />
                  {errors.meta_keywords && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.meta_keywords.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-center flex-wrap  ">
              <FormInput
                id="og_title"
                label="Og-Title:"
                placeholder="Enter og_title"
                register={register("og_title", {
                  required: "og_title is required",
                })}
                error={errors.og_title}
                disabled={!isEditable}
              />
              <FormInput
                id="og_description"
                label="Og-Description:"
                placeholder="Enter og_description"
                register={register("og_description", {
                  required: "og_description is required",
                  minLength: {
                    value: 30,
                    message:
                      "og_description must be at least 30 characters long",
                  },
                })}
                error={errors.og_description}
                disabled={!isEditable}
              />
              <FormInput
                id="og_url"
                label="Og-Url:"
                placeholder="Enter og_url"
                register={register("og_image", {
                  required: "og_image is required",
                })}
                error={errors.og_image}
                disabled={!isEditable}
              />
              <div className=" flex gap-2 w-14 ">
                <div>
                  <label className="text-gray-600 dark:text-gray-400">
                    Json-Ld :
                  </label>
                  <textarea
                    className=" block max-w-80 w-80 py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100 no-scrollbar   "
                    {...register("jsonLd", {
                      required: false,
                    })}
                    placeholder="JSON-LD markup "
                    disabled={!isEditable}
                  />
                  {errors.meta_keywords && (
                    <p className="text-red-500 text-sm mt-1">{"helloe"}</p>
                  )}
                </div>
              </div>
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
          addTableOfContent={addTableOfContent}
        />
      </div>

      <div className="mt-4">
        {!isEditable && (
          <>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsEditable(!isEditable)}
                className="bg-black p-4 py-2 rounded-md  text-white "
              >
                Edit
              </Button>
              {blog.status === "drafted" && (
                <Button
                  onClick={() => {
                    setValue("status", "active");
                    handleSubmit(onSubmit)();
                  }}
                  className="bg-green-400 border-none p-4 py-2 rounded-md  text-black "
                >
                  Post Drafted Blog
                </Button>
              )}
            </div>
          </>
        )}

        {isEditable && (
          <div className=" flex items-center gap-2">
            <Button
              onClick={() => {
                handleSubmit(onSubmit)();
              }}
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
