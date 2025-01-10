 
import { Link, Outlet } from "react-router";
import Navbar from "../components/Navbar";
 
 

function Layout() {
  const tabs = [
    {
      title: "Invoice",
      link: "invoice",
    },
    {
      title: "Products",
      link: "products",
    },
    {
      title: "Customers",
      link: "customers",
    },
  ];
  return (
    <div className="w-screen">
      <div className="" style={{}}>
      <Navbar />
      </div>
      <div className="w-full overflow-hidden flex justify-center " >
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
