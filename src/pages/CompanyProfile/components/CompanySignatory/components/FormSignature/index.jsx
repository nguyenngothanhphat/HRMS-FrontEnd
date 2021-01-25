/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Input, Form, Upload, message, Image, Spin, Modal } from 'antd';
import { connect } from 'umi';
import React, { Component } from 'react';
import s from './index.less';

const { confirm } = Modal;

const propsUpload = {
  name: 'file',
  multiple: false,
  showUploadList: false,
};

@connect()
class FormSignature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  showConfirm = () => {
    const { onRemove = () => {} } = this.props;
    confirm({
      title: 'Do you want to delete these signature?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        onRemove();
      },
      onCancel() {},
    });
  };

  beforeUpload = (file) => {
    const checkType = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!checkType) {
      message.error('You can only upload JPEG/PNG file!');
    }
    const checkSize = file.size / 1024 / 1024 < 2;
    if (!checkSize) {
      message.error(`Image must smaller than 2MB!`);
    }

    return checkType && checkSize;
  };

  normFile = async ({ file }) => {
    this.setState({ loading: true });
    const { dispatch, formRef, field = {} } = this.props;
    const { name } = field;
    const listSignature = formRef.current.getFieldValue('listSignature');
    const cloneArr = [...listSignature];
    let url;
    if (file.status === 'done') {
      const formData = new FormData();
      formData.append('uri', file.originFileObj);
      url = await dispatch({
        type: 'upload/uploadFile',
        payload: formData,
      }).then((resp) => {
        this.setState({ loading: false });
        const { statusCode, data } = resp;
        if (statusCode === 200) {
          const [first] = data;
          const link = first?.url || '';
          const value = cloneArr[name] || {};
          value.urlImage = link;
          cloneArr.splice(name, 1, value);
          formRef.current.setFieldsValue({
            listSignature: cloneArr,
          });
          return first?.url;
        }
        const value = cloneArr[name] || {};
        value.urlImage = undefined;
        cloneArr.splice(name, 1, value);
        formRef.current.setFieldsValue({
          listSignature: cloneArr,
        });
        return undefined;
      });
    }
    return url;
  };

  shouldUpdateForm = (prevValues, currentValues) => {
    const listPrev = prevValues.listSignature || [];
    const listCurrent = currentValues.listSignature || [];
    const listUploadPrev = listPrev.map((item) => item?.urlImage);
    const listUploadCurrent = listCurrent.map((item) => item?.urlImage);
    const check = JSON.stringify(listUploadPrev) !== JSON.stringify(listUploadCurrent);
    return check;
  };

  render() {
    const { field = {} } = this.props;
    const { loading = false } = this.state;
    return (
      <div className={s.root}>
        <div className={s.viewTop}>
          <p className={s.viewTop__title}>Signature {(field?.name || 0) + 1}</p>
        </div>
        <div className={s.viewAddNew}>
          <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between' }}>
            <div className={s.viewAddNew__viewInput}>
              <div>
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
              </div>
              <div>
                <Form.Item
                  {...field}
                  label={false}
                  name={[field.name, 'designation']}
                  fieldKey={[field.fieldKey, 'designation']}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter designation!',
                    },
                  ]}
                >
                  <Input placeholder="Designation" />
                </Form.Item>
              </div>
            </div>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                this.shouldUpdateForm(prevValues, currentValues)
              }
            >
              {({ getFieldValue }) => {
                const listSignature = getFieldValue('listSignature');
                const itemSignature = listSignature[field.name] || {};
                const { urlImage } = itemSignature;
                const check = typeof urlImage === 'string' && urlImage;
                return !check ? (
                  <div>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...field}
                      label={false}
                      name={[field.name, 'urlImage']}
                      getValueFromEvent={this.normFile}
                      fieldKey={[field.fieldKey, 'urlImage']}
                      rules={[
                        {
                          required: true,
                          message: 'Please upload signature!',
                        },
                      ]}
                    >
                      <Upload {...propsUpload} beforeUpload={this.beforeUpload} disabled={loading}>
                        <div className={s.viewAddNew__viewUpload}>
                          <div className={s.viewAddNew__viewUpload__upload}>
                            <div className={s.viewAddNew__viewUpload__upload__icon}>
                              + Upload Signature
                            </div>
                          </div>
                        </div>
                      </Upload>
                    </Form.Item>
                    {loading && (
                      <div className={s.viewLoading}>
                        <span>Uploading</span>
                        <Spin size="small" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className={s.viewAddNew__viewUpload}>
                      <div className={s.viewAddNew__viewUpload__upload}>
                        <Image src={urlImage} />
                      </div>
                    </div>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...field}
                      label={false}
                      name={[field.name, 'urlImage']}
                      getValueFromEvent={this.normFile}
                      fieldKey={[field.fieldKey, 'urlImage']}
                      rules={[
                        {
                          required: true,
                          message: 'Please upload signature!',
                        },
                      ]}
                    >
                      <Upload {...propsUpload} beforeUpload={this.beforeUpload}>
                        <div className={s.viewAddNew__viewUpload__textChange}>Change</div>
                      </Upload>
                    </Form.Item>
                  </div>
                );
              }}
            </Form.Item>
          </div>
          <div className={s.viewAddNew__viewDelete__icon} onClick={this.showConfirm}>
            <DeleteOutlined />
          </div>
        </div>
      </div>
    );
  }
}

export default FormSignature;
