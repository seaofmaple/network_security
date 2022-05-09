import React, { useState, useEffect } from "react";
import {
  Menu,
  Card,
  Space,
  Button
} from 'antd';
import { imgData } from "./img";
import { useNavigate, useLocation } from 'react-router-dom';


const HomeSider = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = props;
  const [selectKeys, setSelectKeys] = useState();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    setSelectKeys(search.get('tab') || 'description')
  }, [location.search]);


  return <>
    <Card
      cover={
        <img
          alt="网络安全"
          src={imgData}
        />
      }
    >
      <Card.Meta 
        title={
          <Space>
            <div>{user.name}</div>
            {
              user.status === 0 &&
              <Button
              type="primary"
              size="small"
              onClick={() => {
                navigate('/login', {replace: true});
              }}
            >
              管理员登录
            </Button>
            }
            {
              user.status === 1 &&
              <Button
              type="primary"
              size="small"
              onClick={() => {
                navigate('/', {replace: true});
                localStorage.removeItem('user');
              }}
            >
              退出登录
            </Button>
            }
          </Space>
        }
        description="欢迎登录"
      />
    </Card>
    <Menu
      mode="inline"
      selectedKeys={selectKeys}
      onSelect={(item) => {
        setSelectKeys(item.key);
        navigate(`?tab=${item.key}`, {replace: false})
      }}
    >
      <Menu.Item key={'description'}>课程介绍</Menu.Item>
      <Menu.Item key={'course'}>课程章节</Menu.Item>
      {
        user.status === 1 &&
        <Menu.Item key={'operation'}>课程管理</Menu.Item>
      }
      {
        user.status === 1 &&
        <Menu.Item key={'admin'}>添加管理员</Menu.Item>
      }
    </Menu>
  </>
}

export default HomeSider