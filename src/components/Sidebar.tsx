export default function Sidebar({ children }) {
  return <div className="sidebar">{children}</div>;
}

export function SidebarTop({ children }) {
  return <div className="sidebar__top">{children}</div>;
}
