import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import { blogRoutes } from "../../api/urls";

export async function uploadImg( file : File ){
  try{
    const formData = new FormData();
    formData.append('Image', file);
    const response = await apiClient.post(blogRoutes.uploadImage , formData)
    if(response.status ==false){
      toast.error(response.error);
      return;
    }
    return Promise.resolve(response.data);
  }catch(err){
    console.log(err)
    return Promise.reject(err);
  }
}

 export  type BlogFormData = {
  slug: string;
  title: string;
  description?: string;
  featuredImage: string;
  body: string;
  category: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
  og_url: string;
  og_title: string;
  og_description: string;
  metaKeywords: string;
};


export function addBlog( blog : BlogFormData ){
  try{

  }catch(err){

  }
}

  export async function createCategory(newCategory : string) {
    try {
      if (newCategory.trim() != "") {
        const response = await apiClient.post(blogRoutes.createCategory, {
          name: newCategory,
        });

        if(response.status === false){
          toast.error(response.error);
          return;
        }
        toast.success("category added successfully");
      }
    } catch (err) {
      console.log(err);
    }
  }