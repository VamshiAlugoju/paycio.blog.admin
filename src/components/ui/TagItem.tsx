import { X } from "lucide-react";

function TagItem({ tagName, onRemove }: any) {
  return (
    <div className="bg-slate-200  outline-none border border-slate-200  rounded-lg cursor-pointer relative  p-1 px-4 ">
      <p className="m-0 text-sm text-slate-800 "> {tagName} </p>
      <span
        className="absolute right-1 top-0"
        onClick={() => {
          onRemove();
        }}
      >
        <X size={12} />
      </span>
    </div>
  );
}

export default TagItem