import { cn } from "../../lib/utils/cn";

function Button({ children, onClick, className ,disabled }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-white p-1 outline-none border border-black rounded-md  ",{ "cursor-pointer" : !disabled }, 
        className
      )}
      style={{ borderColor: "transparent" }}
    >
      {" "}
      {children}{" "}
    </button>
  );
}
export default Button;