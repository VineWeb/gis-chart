import './index.scss'
import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Flex, Layout, Menu, theme } from 'antd';
import { Outlet, Link  } from 'react-router-dom';
const { Header, Content, Sider } = Layout;
const tabs = [
  {label: '首页', path: '/'},
  {label: '查询', path: '/tourism'},
  {label: '图表', path: '/about'},
]
const items1: MenuProps['items'] = tabs.map((item, key) => ({
  key,
  label: <Link to={item.path}>{item.label}</Link>,
}));
const statisticsList = ['旅游', '人口', '考生考试']
const subList = [
  [{ key: `11`, label: '国家AAAAA旅游景区', path: '/'} , { key: `12`, label: '广东旅游年卡A卡', path: '/gd'}],
  [],
  [],
]
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
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className='layout'>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="demo-logo" />
        <Flex justify='center' align="center" style={{paddingLeft: '200px'}}> 
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['0']}
            items={items1}
            style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}
          />
        </Flex>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet></Outlet>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;