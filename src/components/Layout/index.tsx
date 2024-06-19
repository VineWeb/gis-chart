import './index.scss'
import React, { useEffect, useState } from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Button, Row, Col } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Outlet, Link, useLocation  } from 'react-router-dom';
const { Header, Content } = Layout;

const statisticsList = ['旅游', '广州政策','人口', '考生考试']
const subList = [
  [
    { key: `11`, label: '国家AAAAA旅游景区', path: '/'} , 
    { key: `12`, label: '广东旅游年卡A卡', path: '/gd'},
    { key: `13`, label: '国家AAAAA旅游景区查询', path: '/tourism'}
  ],
  [
    { key: `21`, label: '新闻', path: '/guangzhou/news'} ,
    { key: `22`, label: '广州车牌竞价汇总', path: '/guangzhou/yuea'}
  ],
  [
    { key: `31`, label: '图表实例', path: '/population'} ,
  ],
]
const keysList = subList.flat()
const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: statisticsList[index],
      children: subList[index].map((item) => ({
        key: item.key,
        label: <Link to={item.path}>{item.label}</Link>,
      })),
    };
  },
);

const App: React.FC = () => {
  const { token: { borderRadiusLG } } = theme.useToken();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
  // 设置菜单默认选中效果
  useEffect(() => {
    const currentSelect = keysList.find(item => item.path === location.pathname)
    console.log(currentSelect?.key, 'currentSelect', `sub${currentSelect?.key[0] as string}`)
    setSelectedKeys([currentSelect?.key as string])
    setOpenKeys([`sub${currentSelect?.key[0] as string}`])
  }, [])

  const toggleDrawer = () => {
    if (isMobile) {
      setDrawerVisible(!drawerVisible);
    }
  };
  const handleMenuClick = ({ key }: {key: string}) => {
    setSelectedKeys([key]);
    console.log(key, 'handleMenuClick')
  };

  const handleOpenChange = (keys: any) => {
    const currentOpenKey = keys.find((key: string) => openKeys.indexOf(key) === -1);
    console.log(currentOpenKey, 'currentOpenKey')
    setOpenKeys(keys);
    console.log(keys, 'handleOpenChange')
    // open
    if (currentOpenKey) {
      setOpenKeys([currentOpenKey]);
    } else {
      // close
      setOpenKeys([])
    }
  };
  const menu = (
      <Menu
        mode={isMobile? "horizontal": "inline"}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onClick={handleMenuClick}
        onOpenChange={handleOpenChange}
        style={{width: '100%', height: '100%', borderRight: 0 }}
        items={items2}
      />
  )

  return (
    <Layout className='layout'>
      {isMobile && <Header className="site-header" style={{ padding: 0 }}>
        {menu}
        <Button
          className='site-btn'
          type="primary"
          onClick={toggleDrawer}
          icon={<MenuUnfoldOutlined />}
          style={{ marginLeft: '16px', display: 'inline-block' }}
        />
      </Header>}
      <Layout>
      <Row style={{width: "100%", height: '100%'}}>
          <Col xs={0} md={6} lg={6} xl={4} xxl={4}>
            <div className="logo" />
            {menu}
          </Col>
        <Col xs={24} md={18} lg={18} xl={20} xxl={20}>
          <Content
            style={{
              width: "100%",
              height: "100%",
              padding: 24,
              margin: 0,
              background: 'transparent',
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet></Outlet>
          </Content>
        </Col>
      </Row>
      </Layout>
    </Layout>
  );
};

export default App;