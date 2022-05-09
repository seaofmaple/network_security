import React, { useEffect, useState } from "react";
import {
  Layout
} from 'antd';
import HomeSider from "./components/HomeSider";
import HomeContent from "./components/HomeContent";

const { Header , Sider, Content } = Layout;

export const Home = () => {
  const [user, setUser] = useState('');
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
      if(!userInfo) {
        setUser({name: '学生登录', status: 0})
      } else {
        setUser(JSON.parse(userInfo)[0]);
      }
  }, [localStorage.getItem('user')]);

  return (
    <Layout 
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      <Sider 
        style={{
          backgroundColor: '#ffffff',
          borderRight: '1px solid #fbf4f4',
        }}
      >
        <HomeSider user={user}/>
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor:'#007ac6',
            borderBottom: '1px solid #fbf4f4',
          }}
        >
          <h2 style={{color: '#ffffff'}}>《网络安全技术》</h2>
        </Header>
        <Content
          style={{
            backgroundColor: '#ffffff'
          }}
        >
          <HomeContent user={user}/>
        </Content>
      </Layout>
    </Layout>
  )
}