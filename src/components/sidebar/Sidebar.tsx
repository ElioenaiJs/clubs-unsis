import { IoLogoReact, IoPeopleSharp } from "react-icons/io5";
import { SidebarMenuItem } from "./SidebarMenuItem";

const menuItems = [
  {
    path: "/clubs-unsis/clubs",
    icon: <IoPeopleSharp size={24} />,
    title: "Clubs",
    subTitle: "Panel principal de clubes",
  },
];

export const Sidebar = () => {
  return (
    <div
      id="menu"
      className="bg-gray-900 min-h-screen text-slate-300 w-64 fixed left-0 overflow-y-auto"
    >
      <div id="logo" className="my-4 px-6">
        <h1 className="flex items-center text-lg md:text-2xl font-bold text-white">
          <IoLogoReact className="mr-2" />
          <span>Clubs</span>
          <span className="text-blue-500">Unsis.</span>
        </h1>
      </div>

      <div id="nav" className="w-full px-6">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.path} {...item} />
        ))}
      </div>
    </div>
  );
};
