/* eslint-disable react/jsx-props-no-spreading */
import { DeleteOutlined } from '@ant-design/icons';
import { Input, Form, Upload, message, Button } from 'antd';
import { connect } from 'umi';
import React, { Component } from 'react';
import s from './index.less';

@connect()
class FormSignature extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleRemove = () => {
    const { onRemove = () => {} } = this.props;
    onRemove();
  };

  beforeUpload = (file) => {
    const checkType = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const checkSize = file.size / 1024 / 1024 < 2;
    if (!checkSize) {
      message.error(`Image must smaller than 2MB!`);
    }

    return checkType && checkSize;
  };

  normFile = (e) => {
    const { field = {} } = this.props;
    return `url ${field?.name}`;
  };

  render() {
    const { field = {} } = this.props;

    return (
      <div className={s.root} key={field.key}>
        <div className={s.viewTop}>
          <p className={s.viewTop__title}>Signature {(field?.name || 0) + 1}</p>
        </div>
        <div className={s.viewAddNew}>
          <div style={{ width: '68%', display: 'flex', justifyContent: 'space-between' }}>
            <div className={s.viewAddNew__viewInput}>
              <Form.Item
                {...field}
                label={false}
                name={[field.name, 'name']}
                fieldKey={[field.fieldKey, 'name']}
                rules={[
                  {
                    required: true,
                    message: 'Please enter name!',
                  },
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                {...field}
                label={false}
                name={[field.name, 'position']}
                fieldKey={[field.fieldKey, 'position']}
                rules={[
                  {
                    required: true,
                    message: 'Please enter position!',
                  },
                ]}
              >
                <Input placeholder="Position" />
              </Form.Item>
            </div>
            <div className={s.viewAddNew__viewUpload}>
              <div className={s.viewAddNew__viewUpload__upload}>
                <div className={s.viewAddNew__viewUpload__upload__icon}>+</div>
                <Form.Item
                  {...field}
                  label={false}
                  name={[field.name, 'upload']}
                  fieldKey={[field.fieldKey, 'upload']}
                  valuePropName="link"
                  getValueFromEvent={this.normFile}
                  rules={[
                    {
                      required: true,
                      message: 'Please upload!',
                    },
                  ]}
                >
                  <Upload name="logo" action="/upload.do">
                    <Button>Click to upload</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
          </div>
          <div className={s.viewAddNew__viewDelete__icon} onClick={this.handleRemove}>
            <DeleteOutlined />
          </div>
        </div>
      </div>
    );
  }
}

export default FormSignature;
