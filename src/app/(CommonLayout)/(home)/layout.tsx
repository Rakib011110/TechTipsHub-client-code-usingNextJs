import { ReactNode } from "react";

import MyConnection from "@/src/components/home/allflow/MyConnextion";
import AllUser from "@/src/components/home/AllUser/AllUser";

// Define the props interface
interface LayoutProps {
  children: ReactNode;
  newsfeed: ReactNode; // Add newsfeed property
}

const Layout = ({ children, newsfeed }: LayoutProps) => {
  return (
    <div className="h-screen grid grid-cols-12 gap-4 p-1 bg-gray-50">
      {/* Left Sidebar */}
      <aside className="col-span-12 lg:col-span-2 bg-white p-4 rounded-lg shadow-md hidden lg:block">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          My Connections
        </h2>
        <MyConnection />
      </aside>

      {/* Main Content */}
      <main className="col-span-12 lg:col-span-8 bg-white p-6 rounded-lg shadow-md">
        {children}
      </main>

      {/* Right Sidebar */}
      <aside className="col-span-12 lg:col-span-2 bg-white p-1 rounded-lg hidden shadow-md lg:block sticky top-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Connect with Users
        </h2>
        <AllUser />
      </aside>

      {/* Add the newsfeed section */}
      <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-lg shadow-md">
        {/* {newsfeed} Render the newsfeed here */}
      </div>
    </div>
  );
};

export default Layout;
