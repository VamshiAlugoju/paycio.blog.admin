import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import Dropdown from "../components/DropDown";

import Editor from "../components/Editor";
import apiClient from "../api/apiClient";
import { blogRoutes } from "../api/urls";
import Button from "../components/ui/Button";
import TagItem from "../components/ui/TagItem";
import {
  addSubCategoryApi,
  BlogFormData,
  createCategory,
  faqProps,
  uploadBlog,
} from "../lib/utils/blog.lib";
import ImgUploadSection from "../components/ImgUploadSection";
import FormInput from "../components/FormInput";
import slugify from "slugify";
import { toast } from "react-toastify";
import { Loader } from "../assets/Icons/icons";

export type category = {
  name: string;
  sub_categories: string[];
};

const initialFormData: BlogFormData = {
  slug: "",
  title: "",
  featured_img: "",
  body: "",
  tags: "",
  meta_title: "",
  meta_desc: "",
  og_image: "",
  og_title: "",
  og_description: "",
  meta_keywords: "",
  faq: [{ question: "", answer: "" }],
  status: "active",
  author: "Paycio Team",
};

function AddBlog() {
  const [categories, setCategories] = useState<category[]>([]);
  const [newSubcategory, setNewSubCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [newCategory, setNewCateogory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState<string>("");
  const [selectedCategory, setSelctedCategory] = useState<category | null>(
    null
  );
  const [tabelOfContents, setTableOfcontents] = useState<string[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<{
    status: boolean;
    type: "upload" | "draft" | null;
  }>({
    status: false,
    type: null,
  });
  const MAX_FAQS = 4;
  const [faqs, setFaqs] = useState<faqProps[]>([
    { question: "", answer: "" }, // show one by default
  ]);


  const MIN_QUESTION_LENGTH = 10; // minimum characters for question
  const MIN_ANSWER_LENGTH = 20;   // minimum characters for answer




  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    setFocus,
    clearErrors,
    control
  } = useForm<BlogFormData>({
    defaultValues: {
      ...initialFormData,
      faq: [{ question: "", answer: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "faq",
  });
  const title = watch("title");
  function setFieldValue(fieldName: string, value: string) {
    setContent(value);
  }


  const onSubmit = async (data: BlogFormData) => {
    try {

      setLoadingStatus({
        status: true,
        type: "upload",
      });

      const createBlogPayload = {
        ...data,
        tags: tags,
        body: content,
        section_ids: tabelOfContents,
      };

      await uploadBlog(createBlogPayload);
      // reset();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStatus({
        status: false,
        type: null,
      });
    }
  };

  const draftBlog = async (data: BlogFormData) => {
    try {
      setLoadingStatus({
        status: true,
        type: "draft",
      });
      // if (selectedCategory === null) {
      //   toast.error("Select a category");
      //   return;
      // }
      // if (selectedSubCategory === "") {
      //   toast.error("Select a sub category");
      //   return;
      // }
      const createBlogPayload = {
        ...data,
        tags: tags,
        body: content,
        section_ids: tabelOfContents,
        status: "drafted",
      };

      await uploadBlog(createBlogPayload);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStatus({
        status: false,
        type: null,
      });
    }
  };

  async function addCategory() {
    try {
      await createCategory(newCategory);
      setNewCateogory("");
      getCategories();
    } catch (err) {
      console.log(err);
    }
  }
  async function getCategories() {
    try {
      const response = await apiClient.get(blogRoutes.getAllCategories);

      if (response && response.status === false) {
        toast.error("cannot get categories");
        return;
      }
      setCategories(response.categories);
    } catch (err) {
      console.log(err);
    }
  }

  async function addSubCategory() {
    if (selectedCategory) {
      const category = await addSubCategoryApi(
        selectedCategory?.name,
        newSubcategory
      );
      console.log(category);
      setSelctedCategory(category);
      setNewSubCategory("");
      await getCategories();
    }
  }

  function removeTableOfContent(idx: number) {
    setTableOfcontents((prev) => {
      return prev.filter((tag, index) => index !== idx);
    });
  }

  function addTableOfContent(id: string) {
    setTableOfcontents((prev) => [...prev, id]);
  }

  function removeTags(idx: number) {
    setTags((prev) => {
      return prev.filter((tag, index) => index !== idx);
    });
  }

  function addTag(tag: string) {
    setTags((prev) => [...prev, tag]);
    setTagInput("");
  }

  useEffect(() => {
    if (title) {
      setValue("slug", slugify(title, { strict: true, lower: true }));
    }
  }, [title]);

  useEffect(() => {
    (async () => {
      await getCategories();
    })();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

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
              register={register("featured_img", {
                required: "Image url is required",
              })}
              error={errors.featured_img}
            />
          </div>
          <div className="flex items-start gap-4  ">
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
            />
          </div>

          {/* categories list  */}
          <div className="hidden items-center gap-4 my-2 ">
            <div className="mt-2 w-80 px-3 ">
              <label className="" htmlFor="">
                {" "}
                Categories :{" "}
              </label>
              <Dropdown
                onSelect={(option) => {
                  const category = categories.find(
                    (val) => val.name === option
                  );
                  category && setSelctedCategory(category);
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
          {selectedCategory && (
            <div className="hidden items-center gap-4 my-2 ">
              <div className="mt-2 w-80 px-3 ">
                <label className="" htmlFor="">
                  {" "}
                  Sub Category :{" "}
                </label>
                <Dropdown
                  onSelect={(option) => {
                    // setSelctedCategory(option);
                    setSelectedSubCategory(option);
                  }}
                  options={selectedCategory.sub_categories?.map(
                    (items) => items
                  )}
                />
              </div>

              {/* // add sub cateogory  */}
              <div className="flex items-center gap-2 ">
                <input
                  type=""
                  className="border p-1 rounded-md "
                  placeholder="Sub Category"
                  value={newSubcategory}
                  onChange={(e) => {
                    setNewSubCategory(e.target.value);
                  }}
                />
                <button
                  disabled={newSubcategory.length === 0}
                  className="bg-black text-white p-1 px-2 outline-none border border-black rounded-md cursor-pointer "
                  onClick={addSubCategory}
                >
                  {" "}
                  Add SubCategory{" "}
                </button>
              </div>
            </div>
          )}

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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTag(tagInput);
                  }
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
            <div className="flex gap-4 items-center  my-4  flex-wrap ">
              <FormInput
                id="metaTitle"
                label="Meta-Title:"
                placeholder=" Enter meta title"
                register={register("meta_title", {
                  required: "MetaTitle is required",
                })}
                error={errors.meta_title}
              />

              <FormInput
                id="metaDescription"
                label="Meta-Description:"
                placeholder=" Enter meta description"
                register={register("meta_desc", {
                  required: "MetaDescription is required",
                  minLength: {
                    value: 30,
                    message:
                      "og_description must be at least 30 characters long",
                  },
                })}
                error={errors.meta_desc}
              />
              <div className=" flex gap-2">
                <div>
                  <label className="text-gray-600 dark:text-gray-400">
                    Meta Keywords:
                  </label>
                  <textarea
                    className=" block w-80 py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100   "
                    {...register("meta_keywords", {
                      required: "metaKeywords is required",
                    })}
                    placeholder="Enter meta keywords"
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
              />
              <FormInput
                id="og_url"
                label="Og-Url:"
                placeholder="Enter og_url"
                register={register("og_image", {
                  required: "og_url is required",
                })}
                error={errors.og_image}
              />
            </div>
          </div>
        </div>

        {/* right section  */}
        <div>
          <ImgUploadSection />
        </div>
      </div>
      <div className="w-full max-w-[80%] mr-auto">
        <h2 className="text-lg font-semibold mb-4">FAQs</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {fields.map((field, index) => (
            <div className="relative border border-slate-200 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between gap-2">
                <h3>FAQ #${index + 1}</h3>
                {fields.length > 1 && (
                  <button type="button" className="p-1 outline-none border border-red-600 rounded-md cursor-pointer py-1 text-sm px-2 bg-red-600 text-white" onClick={() => remove(index)}>✕</button>
                )}
              </div>
              <div key={field.id} className="faq-item">
                <div className="mb-4">
                  <input className="block w-full  py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100 "
                    placeholder="Question" style={{ width: '-webkit-fill-available' }}
                    {...register(`faq.${index}.question`, {
                      required: "Question is required",
                      minLength: {
                        value: MIN_QUESTION_LENGTH,
                        message: `Question must be at least ${MIN_QUESTION_LENGTH} characters`,
                      },
                    })}
                    onKeyUp={() => clearErrors(`faq.${index}.question`)}
                  />
                  {errors.faq?.[index]?.question && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.faq[index].question?.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <textarea className="block w-full  py-2 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow dark:bg-gray-600 dark:text-gray-100 "
                    placeholder="Answer" style={{ width: '-webkit-fill-available' }}
                    {...register(`faq.${index}.answer`, {
                      required: "Answer is required",
                      minLength: {
                        value: MIN_ANSWER_LENGTH,
                        message: `Answer must be at least ${MIN_ANSWER_LENGTH} characters`,
                      },
                    })}
                    onKeyUp={() => clearErrors(`faq.${index}.answer`)}
                  />
                  {errors.faq?.[index]?.answer && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.faq[index].answer?.message}
                    </p>
                  )}
                </div>


              </div>
            </div>
          ))}

        </div>

        {fields.length < 4 && (
          <button
            type="button"
            onClick={async () => {
              // const isValid = await trigger("faq");
              // if (isValid) {
                append({ question: "", answer: "" });
              // } else {
              //   toast.error("Please fill all existing FAQs before adding a new one");
              // }
            }}
            className="p-1 mt-3 outline-none border border-black rounded-md cursor-pointer py-2 text-sm px-6 bg-black text-white"
          >
            + Add FAQ
          </button>
        )}


      </div>

      {/* blog editor section  */}
      <div className="  w-full ">
        <h3>body:</h3>
        <Editor
          placeholder=""
          setFieldValue={setFieldValue}
          addTableOfContent={addTableOfContent}
        />
      </div>
      <div className="flex gap-4 items-center w-full justify-center ">
        <Button
          onClick={handleSubmit(onSubmit)}
          className="bg-black p-4 py-2 rounded-md mt-4 text-white "
        >
          {loadingStatus.status && loadingStatus.type === "upload" ? (
            <Loader className="w-4 h-4" />
          ) : (
            "Submit"
          )}
        </Button>
        <Button
          onClick={handleSubmit(draftBlog)}
          className="bg-black p-4 py-2 rounded-md mt-4 text-white "
        >
          {loadingStatus.status && loadingStatus.type === "draft" ? (
            <Loader className="w-4 h-4" />
          ) : (
            "Add to Drafts"
          )}
        </Button>
      </div>
      <div className="h-12"></div>
    </div>
  );
}

export default AddBlog;
