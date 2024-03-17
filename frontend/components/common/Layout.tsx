"use client";
import React, { useEffect, useState } from "react";
import { UsergroupAddOutlined, ProjectOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

const Layouts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      icon: <UsergroupAddOutlined />,
      key: "/user",
      label: "Users",
    },
    {
      icon: <ProjectOutlined />,
      key: "/projects",
      label: "Projects",
    },
  ];

  const [selectedKey, setSelectedKey] = useState(
    menuItems.find((item) => pathname.startsWith(item?.key as string))?.key ??
      ""
  );

  useEffect(() => {
    setSelectedKey((k) => {
      let key;
      const itemKey = menuItems.find((item) => {
        return pathname.startsWith(item.key as string);
      })?.key;

      return key ?? itemKey ?? "";
    });
  }, [pathname]);

  const logout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="demo-logo-vertical" />
            <Menu
              theme="dark"
              onSelect={({ key }) => {
                setSelectedKey(key);
                router.push(`${key}`);
              }}
              mode="vertical"
              items={menuItems}
              selectedKeys={[selectedKey]}
              defaultSelectedKeys={["/users"]}
            />
          </div>

          <div
            className="text-white text-center cursor-pointer pb-4"
            onClick={logout}
          >
            logout
          </div>
        </div>
      </Sider>
      <Layout className="px-4">{children}</Layout>
    </Layout>
  );
};

export default Layouts;
