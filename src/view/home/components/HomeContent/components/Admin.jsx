import React, { useState, useEffect, useRef } from "react";
import {
  List,
  Space,
  Button,
  Tag,
  Popover,
  Modal,
  Form,
  Input,
  message
} from 'antd';
import { request } from "../../../../../utils/request";
import * as echarts from 'echarts';

const Admin = () => {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const chartsRef = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    request({
      url: '/list',
    }).then(res => {
      setList(res.data);
      const admin = res.data.filter(item => item.status === 1).length;
      const user = res.data.filter(item => item.status === 0).length;
      setTimeout(() => {
        const myChart = echarts.init(chartsRef.current);
        setChart(myChart);
        myChart.setOption(initCharts(admin, user));
      })
    })
  }, []);

  function initCharts(admin, user) {
    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '管理员与普通用户人数表',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold',
              color: '#ee6766'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: admin, name: '管理员' },
            { value: user, name: '普通用户' },
          ]
        }
      ]
    }
  }

  return (
    <>
      <Space 
      align="baseline" 
      size="large"
      >
        <div>
          <h3
          style={{
            color: '#007ac6',
          }}
          >管理员列表</h3>
          <List
            bordered
            style={{
              width: 300
            }}
          >
            {
              list.filter(item => item.status === 1).map((item, index) => {
                return <List.Item key={item.id}>
                  <Space>
                    <div style={{color: '#007ac6', fontSize: 18}} >{index+1}</div>
                    <div style={{
                      width: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      <Popover content={item.name} title="用户名">
                        {item.name}
                      </Popover>
                    </div>
                    <div>
                      <Tag color={'#08aa6d'}>管理员</Tag>
                    </div>
                  </Space>
                </List.Item>
              })
            }
          </List>
          <Button 
            style={{
              float: 'right',
              marginTop: 10
            }}
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            添加管理员
          </Button>
        </div>
        <div>
          <h3 style={{color: '#007ac6',}}>管理员与普通用户人数表</h3>
          <div ref={chartsRef} style={{width: 500, height: 300}}/>
        </div>
      </Space>
      <Modal 
        visible={visible}
        okText="确定添加"
        cancelText="取消"
        title="添加管理员"
        onCancel={() => setVisible(false)}
        onOk={async () => {
          await form.validateFields();
              const formData = form.getFieldsValue();
              if(formData) {
                if(formData.password === formData.re_password) {
                  request({
                    url: '/register',
                    params: {
                      account: formData.account,
                      password: formData.password
                    }
                  }).then(res => {
                    setVisible(false);
                    message.info(res.data.data);
                    request({
                      url: '/list',
                    }).then(res => {
                      setList(res.data);
                      const admin = res.data.filter(item => item.status === 1).length;
                      const user = res.data.filter(item => item.status === 0).length;
                      setTimeout(() => {
                        chart.setOption(initCharts(admin, user));
                      })
                    })
                  })
                } else {
                  message.info('两次密码不一致')
                }
              }
        }}
      >
      <div className="formDiv">
        <Form 
          form={form}
          autoComplete="off"
          labelCol={{span: 8}}
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
          <Form.Item
            label="确认密码"
            name="re_password"
            rules={[{
              required: true,
              message: '密码不能为空'
            }]}
          >
            <Input.Password/>
          </Form.Item>
        </Form>
      </div>
      </Modal>
    </>
  )
  
}

export default Admin