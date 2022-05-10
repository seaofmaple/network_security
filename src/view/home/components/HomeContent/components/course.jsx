import React, { useState, useEffect } from "react";
import {
  Menu,
  Empty,
  Divider,
  Card,
  Space,
  Button,
  message
} from 'antd';
import { request } from "../../../../../utils/request";
import { FilePptTwoTone } from '@ant-design/icons';


const Course = () => {
  const [courseList, setCourseList] = useState([]);
  const [select, setSelect] = useState({});

  function download(url, fileName){
    const formEle = document.createElement('form')
    formEle.action = url
    formEle.method = 'get'
    formEle.style.display = 'none'
    const formItem = document.createElement('input')
    formItem.value = fileName
    formItem.name = fileName
    formEle.appendChild(formItem)
    document.body.appendChild(formEle)
    formEle.submit()
    document.body.removeChild(formEle)
}


  useEffect(() => {
    request({
      url: '/courseList'
    }).then(res => {
      setCourseList(res.data);
      setSelect(res.data[0])
    })
  }, []);
  return <div
    style={{
      display: 'flex',
    }}
  >
    <div 
      style={{
        width: 'calc(100% - 300px)',
        height: 'calc(100% - 200px)'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRight: '1px solid #aaa',
          borderBottom: '1px solid #aaa',
          padding: 10
        }}
      >
        <div>
          <h3 style={{color: '#007ac6'}}>章节介绍</h3>
          <Card>
            <Card.Meta 
              title={
                select.description ? 
                <div dangerouslySetInnerHTML={{__html: select.description}}/> 
                :
                <Empty description="暂无介绍"/>
              }
            />
          </Card>
        </div>
        <Divider/>
        <div style={{
          textAlign: 'center'
        }}>
          <video controls height='470px' width='900px' src={select.videoUrl} />
        </div>
      </div>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRight: '1px solid #aaa',
          borderBottom: '1px solid #aaa',
          overflow: 'auto',
          padding: 10
        }}
      >
        <h3 style={{color: '#007ac6'}}>课件PPT</h3>
        {
          select.pptName ? 
          <div>
            <Card>
              <Card.Meta
                title={
                  <Space>
                    <div><FilePptTwoTone style={{fontSize: 30}}/></div>
                    <div dangerouslySetInnerHTML={{__html: select.pptName + '.ppt'}}></div>
                    <Button
                      type="primary"
                      style={{
                        marginLeft: 50
                      }}
                      onClick={() => {
                        if(select.pptUrl) {
                          download(select.pptUrl, select.pptName);
                        } else {
                          message.info('暂时没有PPT');
                        }
                      }}
                    >下载</Button>
                  </Space>
                }
              />
            </Card>
          </div> 
          :
          <Empty description="暂无ppt"/>
        }
      </div>
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRight: '1px solid #aaa',
          minHeight: 230,
          overflow: 'auto',
          padding: 10
        }}
      >
        <h3 style={{color: '#007ac6'}}>课后作业</h3>
        <Card>
          <Card.Meta
            title={
              select.homework ? 
              <div dangerouslySetInnerHTML={{__html: select.homework}}/> 
              :
              <Empty description="暂无作业"/>
            }
          />
        </Card>
      </div>
    </div>
    <div 
      style={{
        backgroundColor: '#ffffff',
        padding: 10
      }}
    > 
      <h3 style={{color: '#007ac6'}}>课程章节</h3>
      <Menu 
        style={{
          width: 280
        }}
        onSelect={(item) => {
          setSelect(courseList.filter(v => v.courseName === item.key)[0]);
        }}
        selectedKeys={select.courseName}
      >
        {
          courseList.map((item, index) => {
            return <Menu.Item 
              key={item.courseName}
              >
              {index+1}.{item.courseName}
            </Menu.Item>
          })
        }
      </Menu>
    </div>
  </div>
}

export default Course