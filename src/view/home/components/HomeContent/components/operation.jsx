import React, { useState, useEffect } from "react";
import {
  Menu,
  Space,
  Button,
  Drawer,
  Form,
  Input,
  Upload,
  Popconfirm,
  Divider,
  Popover,
  message,
} from 'antd';
import { request } from "../../../../../utils/request";
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const Operation = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [select, setSelect] = useState({});
  const [des, setDes] = useState('');
  const [homework, setHomework] = useState('');
  const [videoToken, setVideoToken] = useState('');
  const [pptToken, setPptToken] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pptUrl, setPptUrl] = useState('');

  useEffect(() => {
    request({
      url: '/courseList'
    }).then(res => {
      const data = res.data[0];
      setCourseList(res.data);
      setSelect(res.data[0]);
      setDes(BraftEditor.createEditorState(data.description));
      setHomework(BraftEditor.createEditorState(data.homework));
    });
    request({
      url: '/uploadVideo'
    }).then(res => {
      const { token } = res.data;
      setVideoToken(token)
    });
    request({
      url: '/uploadPPT'
    }).then(res => {
      const { token } = res.data;
      setPptToken(token)
    });
  }, []);

  return <div 
    style={{
      padding: 10,
      height: '100%',
      display:'flex'
    }}
    >
    <div 
      style={{
        width: 200
      }}
    >
      <h2 style={{color: '#007ac6'}}>课程列表</h2>
      <Menu 
        onSelect={(item) => {
          const data = courseList.filter(v => v.courseName === item.key)[0];
          setSelect(data);
          setDes(BraftEditor.createEditorState(data.description));
          setHomework(BraftEditor.createEditorState(data.homework));
        }}
        selectedKeys={select.courseName}
      >
        {
          courseList.map(item => {
            return <Menu.Item key={item.courseName}>
              <Space>
                <Popover content={item.courseName}>
                <div 
                  style={{
                    width: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                {item.courseName}
                </div>
                </Popover>
                <Popconfirm
                  cancelText="我再想想"
                  okText="确认删除"
                  title="确定删除该课程吗？"
                  onConfirm={() => {
                    request({
                      url: 'deleteCourse',
                      method: 'POST',
                      data: {
                        courseName: select.courseName
                      }
                    }).then(res => {
                      message.info('删除成功');
                      request({
                        url: '/courseList'
                      }).then(res => {
                        const data = res.data[0];
                        setCourseList(res.data);
                        setSelect(res.data[0]);
                        setDes(BraftEditor.createEditorState(data.description));
                        setHomework(BraftEditor.createEditorState(data.homework));
                      });
                    })
                  }}
                >
                  <Button type="primary" size="small">删除</Button>
                </Popconfirm>
              </Space>
            </Menu.Item>
          })
        }
      </Menu>
      <Button
        type="primary"
        style={{
          marginTop: 10,
          float: 'right'
        }}
        onClick={() => setVisible(true)}
      >添加课程</Button>
    </div>
    <Divider type="vertical"/>
    <div
      style={{
        marginLeft: 20
      }}
    >
      <h2>课后作业</h2>
      <BraftEditor
        value={homework}
        onChange={(editorState) => {
          setHomework(editorState);
        }}
        style={{
          height: 300,
          marginTop: 30
        }}
        contentStyle={{
          height: 200
        }}
      />
      <Divider/>
      <h2>章节介绍</h2>
      <BraftEditor
        value={des}
        onChange={(editorState) => {
          setDes(editorState);
        }}
        style={{
          height: 300,
          marginTop: 30
        }}
        contentStyle={{
          height: 200
        }}
      />
      <Button 
        type="primary"
        onClick={() => {
          console.log({
            des,
            homework
          })
          request({
            url: '/change',
            method: 'POST',
            data: {
              des: des.toHTML(),
              homework: homework.toHTML(),
              courseName: select.courseName
            }
          }).then(res => {
            message.info(res.data.message)
          })
        }}
      >提交修改</Button>
    </div>
    <Drawer
      visible={visible}
      title="添加课程"
      onClose={() => setVisible(false)}
      width={900}
      footer={
        <div style={{float: 'right'}}>
          <Button 
            type="primary"
            onClick={() => setVisible(false)}
            style={{
              marginRight: 20
            }}
          >取消</Button>
          <Button
            type="primary"
            onClick={async () => {
              await form.validateFields();
              const formData = form.getFieldsValue();
              if(pptUrl && videoUrl) {
                const data = {
                  ...formData,
                  homework: formData.homework.toHTML(),
                  description: formData.description.toHTML(),
                  pptUrl,
                  videoUrl
                } 
                request({
                  url: 'addCourse',
                  method: 'POST',
                  data
                }).then(res => {
                  message.info('添加成功');
                  setVisible(false);
                  request({
                    url: '/courseList'
                  }).then(res => {
                    const data = res.data[0];
                    setCourseList(res.data);
                    setSelect(res.data[0]);
                    setDes(BraftEditor.createEditorState(data.description));
                    setHomework(BraftEditor.createEditorState(data.homework));
                  });
                })
              } else {
                message.error('你还没有上传视频或者PPT')
              }
              
            }}
          >确认添加</Button>
        </div>
      }
    >
      <Form
        form={form}
        autoComplete="off"
      >
        <Form.Item 
          name="courseName" 
          label="章节名称"
          rules={[
            {
              required: true,
              message: '章节名称不能为空'
            }
          ]}
        >
          <Input/>
        </Form.Item>
        <Form.Item 
          name="description" 
          label="章节介绍"
          rules={[
            {
              required: true,
              message: '章节介绍不能为空'
            }
          ]}
        >
          <BraftEditor
            contentStyle={{
              height: 300
            }}
          />
        </Form.Item>
        <Upload 
          style={{marginBottom: 10}}
          name="file"
          action='http://up-z2.qiniup.com'
          data={{
            token: videoToken,
            fileKey: Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + 1
          }}
          maxCount={1}
          onChange={(info) => {
            if (info.file.status === 'done') {
              setVideoUrl('http://rab9rc7xw.hn-bkt.clouddn.com/' + info.file.response.key)
            }
          }}
        >
          <Button>上传课程视频</Button>
        </Upload>
        <Form.Item 
          name="pptName" 
          label="PPT名称"
          rules={[
            {
              required: true,
              message: 'PPT名称不能为空'
            }
          ]}
        >
          <Input/>
        </Form.Item>
        <Upload 
          style={{marginBottom: 10}}
          name="file"
          action='http://up-z2.qiniup.com'
          data={{
            token: pptToken,
            fileKey: `${Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + 1}.ppt`
          }}
          maxCount={1}
          onChange={(info) => {
            if (info.file.status === 'done') {
              setPptUrl('http://rabas52kz.hn-bkt.clouddn.com/' + info.file.response.key)
            }
          }}
        >
          <Button>上传PPT</Button>
        </Upload>
        <Form.Item 
          name="homework" 
          label="课后作业"
          rules={[
            {
              required: true,
              message: '课后作业不能为空'
            }
          ]}
        >
          <BraftEditor
            contentStyle={{
              height: 300
            }}
          />
        </Form.Item>
      </Form>
    </Drawer>
  </div>
}

export default Operation