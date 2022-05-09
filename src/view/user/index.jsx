import React from "react";
import { 
  Button,
  Form,
  Input,
  message,
  Tabs
} from 'antd';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { request } from "../../utils/request";
import bgImage from './favicon.png';

export const User = () => {
  const [form] = Form.useForm();
  const [registerForm] = Form.useForm();
  const navigate = useNavigate();
  const { TabPane } = Tabs;

  return <LoginDiv>
    <Tabs 
      defaultActiveKey="login"
      style={{
        backgroundColor: '#ffffff',
        padding: 5
      }}
    >
      <TabPane key="login" tab="登录">
      <div className="formDiv">
        <Form 
          form={form}
          autoComplete="off"
        >
          <Form.Item
            label="账号"
            name="account"
            rules={[
              {
                required: true,
                message: '账号不能为空'
              }
            ]}
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{
              required: true,
              message: '密码不能为空'
            }]}
          >
            <Input.Password/>
          </Form.Item>
        </Form>
        <div className="btn-div">
          <Button 
            type="primary"
            onClick={() => {
              form.setFieldsValue({
                account: '',
                password: ''
              })
            }}
          >重置</Button>
          <Button
            type="primary"
            onClick={async () => {
              await form.validateFields();
              const formData = form.getFieldsValue();
              if(formData) {
                if(formData) {
                  request({
                    url: '/login',
                    params: formData
                  }).then(res => {
                    if(res.data.length > 0) {
                      navigate('/home', { replace: true });
                      localStorage.setItem('user', JSON.stringify(res.data));
                    } else {
                      message.error('账号或者密码错误');
                    }
                  })
                }
              }
            }}
          >登录</Button>
        </div>
      </div>
      </TabPane>
    </Tabs>
  </LoginDiv>
}

const LoginDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url(${bgImage});
  background-size: 100% 100%;
  .btn-div {
    display: flex;
    justify-content: space-between;
    border-radius: 2px;
  }
`;