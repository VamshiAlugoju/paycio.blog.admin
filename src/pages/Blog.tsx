import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import apiClient from "../api/apiClient";
import { blogRoutes } from "../api/urls";
import { BlogPost } from "./Blogs";
import UpdateSection from "../components/UpdateSection";
import { category } from "./AddBlog";
import Button from "../components/ui/Button";

function Blog() {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isEditable, setIsEditable] = useState(false);
  const [categories, setCategories] = useState<category[]>([]);

  const params = useParams();
  console.log(params);

  async function getBlogBySlug(Slug: string) {
    try {
      setLoading(true);
      const response = await apiClient.get(blogRoutes.getBlogBySlug + Slug);
      console.log(response);
      setBlog(response.blog);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      if (params.id) {
        await getBlogBySlug(params.id);
      }
      const categoriesResp = await apiClient.get(blogRoutes.getAllCategories);
      setCategories(categoriesResp.categories);
    })();
  }, []);

  return (
    <div>
      {loading && <p>loading</p>}
      {!loading && blog && (
        <>
          <div className="w-full flex justify-center ">
            <UpdateSection
              blog={blog}
              categories={categories}
              isEditable={isEditable}
            />
          </div>
          <div className="w-full flex justify-center items-center mb-6 ">
            <div  className= " flex items-center " >
              {!isEditable && (
                <Button
                  onClick={() => setIsEditable(!isEditable)}
                  className="bg-black p-4 py-2 rounded-md  text-white "
                >
                  Edit
                </Button>
              )}

              {isEditable && (
                <div className=" flex items-center gap-2" >
                      <Button
                    onClick={() => setIsEditable(!isEditable)}
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
          </div>
       
        </>
      )}
    </div>
  );
}

export default Blog;
