import React, { useState } from "react";
import Button from "./ui/Button";
import { Copy } from "lucide-react";
import { uploadImg } from "../lib/utils/blog.lib";
import "./ImgUpload.css";
import { Loader } from "../assets/Icons/icons";
import { toast } from "react-toastify";

export default function ImgUploadSection() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [showToolTip, setShowTooltip] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(imgUrl);
      // Show tooltip
      setShowTooltip(true);

      // Hide tooltip after 1.5 seconds
      setTimeout(() => {
        setShowTooltip(false);
      }, 1500);
    } catch (err) {
      toast.error("failed to copy the url");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <label htmlFor="featuredImage font-bold "> Upload Image </label>
        <input
          id="uploadImg"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setShowTooltip(false);
              setSelectedImage(e.target.files[0]);
            }
          }}
        />
      </div>
      <div>
        <Button
          className="bg-black text-white min-w-24 flex items-center justify-center "
          onClick={async () => {
            try {
              setIsUploading(true);
              if (selectedImage) {
                setImgUrl("");
                const imgDetails = await uploadImg(selectedImage);
                setImgUrl(imgDetails.location);
              }
            } catch (err) {
              console.log(err);
            } finally {
              setIsUploading(false);
            }
          }}
        >
          {isUploading ? <Loader className="w-4 h-4" /> : "Upload Image"}{" "}
        </Button>
      </div>
      <div className="  ">
        <p className="text-sm mb-1"> Image Url:</p>
        {imgUrl && imgUrl != "" && (
          <div className=" w-fit max-w-32 bg-gray-200 rounded-md text-xs p-1 px-2  flex gap-2 items-center ">
            <p className="m-0 truncate "> {imgUrl} </p>
            <span
              className="cursor-pointer tooltip-container"
              onClick={handleCopy}
            >
              <Copy size={12} />
              {showToolTip && <span className="tooltip text-xs">Copied!</span>}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
