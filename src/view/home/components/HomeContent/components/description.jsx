import React, { useState, useEffect } from "react";
import {
  Descriptions,
  Button,
  message
} from 'antd';
import { request } from "../../../../../utils/request";
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const Description = (props) => {
  const [des, setDes] = useState({});
  const [newDes, setNewDes] = useState('');
  const [visible, setVisible] = useState(false);
  const {user} = props;

  useEffect(() => {
    request({
      url: '/getDes'
    }).then(res => {
      setDes(res.data[0]);
    })
  }, [])

  return <>
    <Descriptions
      column={1}
      layout="vertical"
      bordered
      contentStyle={{
        width: 600
      }}
      labelStyle={{
        color: '#007ac6',
        fontSize: 18,
      }}
    >
      <Descriptions.Item label="课程名称" style={{textIndent: 32}} labelStyle={{fontWeight: 'bolder'}}>
      {
        des.name
      }
      </Descriptions.Item>
      <Descriptions.Item label="课程英文名称" style={{textIndent: 32, color: 'InfoText'}} labelStyle={{fontWeight: 'bolder'}}>
      {
        des.englishName
      }
      </Descriptions.Item>
      <Descriptions.Item label="课程介绍" style={{textIndent: 32}} labelStyle={{fontWeight: 'bolder'}}>
      {
        !visible &&
        <div dangerouslySetInnerHTML={{__html: des.description}}/>
      }
      {
        user.status === 1 && !visible &&
        <div style={{
          float: 'right'
        }}>
          <Button
            type="primary"
            onClick={() => {
              setVisible(true)
            }}
          >
            编辑
          </Button>
        </div>
      }
      {
        visible && 
        <div style={{height: 50, textAlign: 'center'}}>
          <div style={{color: '#007ac6', fontSize: 18}}>编辑课程介绍</div>
          <div style={{float: 'right', marginBottom: 10}}>
            <Button
              type="primary"
              onClick={() => {
                request({
                  url: '/description',
                  method: 'POST',
                  data: {
                    description: newDes
                  }
                }).then(res => {
                  message.info(res.data.message);
                  request({
                    url: '/getDes'
                  }).then(res => {
                    setDes(res.data[0]);
                    setVisible(false);
                  })
                })
              }}
            >提交</Button>
          </div>
        </div>
      }
      {
        visible && 
          <BraftEditor
            defaultValue={BraftEditor.createEditorState(des.description)}
            onChange={(editorState) => {
              setNewDes(editorState.toHTML());
            }}
            style={{
              height: 400,
              marginTop: 30
            }}
          />
      }
      </Descriptions.Item>
    </Descriptions>
  </>
}

export default Description