import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import { blogRoutes } from "../../api/urls";

export async function uploadImg(file: File) {
  try {
    const formData = new FormData();
    formData.append("Image", file);
    const response = await apiClient.post(blogRoutes.uploadImage, formData);
    if (response.status == false) {
      toast.error(response.error);
      return;
    }
    return Promise.resolve(response.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}
export type faqProps = {
  question: string;
  answer : string
}

export type BlogFormData = {
  slug: string;
  title: string;
  description?: string;
  featured_img: string;
  body: string;
  tags: string;
  meta_title: string;
  meta_desc: string;
  og_image: string;
  og_title: string;
  og_description: string;
  meta_keywords: string;
  faq: faqProps[]
  status: "active" | "drafted";
  author: "Paycio Team";
};

export async function uploadBlog(payload: any) {
  try {
    const response = await apiClient.post(blogRoutes.createBlog, payload);

    if (response && response.status === false) {
      toast.error(response.error);
      return;
    }
    toast.success("added blog successfully");
    return Promise.resolve(response.data);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function updateBlog(payload: any, id: string) {
  try {
    const response = await apiClient.post(blogRoutes.updateBlog + id, payload);
    if (!response.status) {
      toast.error(response.message);
      return;
    }
    toast.success("Blog updated successfully");
    return Promise.resolve(response);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function createCategory(newCategory: string) {
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

export async function addSubCategoryApi(category: string, subCategory: string) {
  try {
    if (subCategory.trim() != "") {
      const response = await apiClient.post(blogRoutes.createCategory, {
        name: subCategory,
        type: "sub",
        category_name: category,
      });

      if (response.status === false) {
        toast.error(response.error);
        return;
      }
      toast.success("subCategory added successfully");
      return response.category;
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getDrafts() {
  try {
    const response = await apiClient.get(blogRoutes.getDrafts);
    if (response.status === false) {
      toast.error(response.error);
      return;
    }
    return Promise.resolve(response.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}

export async function getActiveBlogs() {
  try {
    const response = await apiClient.get(blogRoutes.getActiveBlogs);
    if (response.status === false) {
      toast.error(response.error);
      return;
    }
    return Promise.resolve(response.data);
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
}

export async function deleteBlog(slug: string) {
  try {
    const response = await apiClient.delete(blogRoutes.deleteBlog + slug);
    if (response.status === false) {
      toast.error(response.error);
      return;
    }
    toast.success("Blog deleted successfully");
  } catch (err) {
    console.log(err);
  }
}
