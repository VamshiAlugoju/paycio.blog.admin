import { useEffect, useState } from "react";

import { Link } from "react-router";
import { useLocation } from "react-router";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const location = useLocation();

  const [navigation, setNavigationTabs] = useState([
    { name: "AddBlog", href: "add", current: false },
    { name: "Blogs", href: "blogs", current: false },
  ]);

  useEffect(() => {
    setNavigationTabs((prev) => {
      const tabss = prev.map((item) => {
        if (location.pathname.includes(item.href)) {
          return { ...item, current: true };
        }
        return { ...item, current: false };
      });
      return tabss;
    });
  }, [location.pathname]);

  return (
    <div className="mx-auto  px-2 sm:px-6 lg:px-8">
      <div className="relative flex py-3 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden"></div>
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="flex shrink-0 items-center ">
            <Link to={"/"}>
              <img
                alt="Your Company"
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-black hover:bg-slate-300  ",
                    "rounded-md px-3 py-2 text-sm font-medium no-underline "
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* can put */}
      </div>
    </div>
  );
}
