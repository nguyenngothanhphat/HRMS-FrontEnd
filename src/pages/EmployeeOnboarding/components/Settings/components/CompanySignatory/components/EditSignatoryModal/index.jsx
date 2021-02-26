import React, { PureComponent } from 'react';
import { Button, Modal, Form, Input, Upload, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'umi';

import styles from './index.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
@connect(
  ({
    companiesManagement: {
      originData: { companyDetails: { companySignature = [] } = {} } = {},
    } = {},
    loading,
  }) => ({
    companySignature,
    loadingUpdateSignature: loading.effects['companiesManagement/updateCompany'],
    loadingUploadFile: loading.effects['upload/uploadFile'],
  }),
)
class EditSignatoryModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      uploadedImageUrl: '',
    };
  }

  handleChange = async ({ file = {} }) => {
    const { dispatch } = this.props;
    // if (file.status === 'uploading') {
    //   this.setState({ loading: true });
    //   return;
    // }
    if (file.status === 'done') {
      const formData = new FormData();
      formData.append('uri', file.originFileObj);
      await dispatch({
        type: 'upload/uploadFile',
        payload: formData,
      }).then((resp) => {
        this.setState({ loading: false });
        const { statusCode, data = [] } = resp;
        if (statusCode === 200) {
          const [first] = data;
          const link = first?.url || '';
          this.setState({ uploadedImageUrl: link });
          this.formRef.current.setFieldsValue({
            urlImage: link,
          });

          // Get this url from response in real world.
          // getBase64(file.originFileObj, () =>
          //   this.setState({
          //     loading: false,
          //   }),
          // );
        }
      });
    }
  };

  render() {
    const {
      loadingUpdateSignature,
      visible,
      editPack = {},
      onOk = () => {},
      onClose = () => {},
      loadingUploadFile,
    } = this.props;
    const { uploadedImageUrl } = this.state;
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal
        className={styles.EditSignatoryModal}
        destroyOnClose
        centered
        visible={visible}
        footer={null}
        onCancel={onClose}
      >
        <div className={styles.container}>
          <div className={styles.header}>
            <span>
              {Object.keys(editPack).length !== 0 ? 'Edit signature' : 'Add new signature'}
            </span>
          </div>
          <div className={styles.form}>
            <Form
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...layout}
              name="basic"
              initialValues={{
                name: editPack.name,
                designation: editPack.designation,
                urlImage: editPack.urlImage,
              }}
              onFinish={onOk}
              ref={this.formRef}
              id="myForm"
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please input name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Designation"
                name="designation"
                rules={[{ required: true, message: 'Please input designation!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="File"
                name="urlImage"
                rules={[{ required: true, message: 'Please upload file!' }]}
              >
                <Upload
                  listType="picture-card"
                  onChange={this.handleChange}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                >
                  {!editPack.urlImage && (
                    <>
                      {uploadedImageUrl ? (
                        <img src={uploadedImageUrl} alt="avatar" style={{ maxWidth: '200px' }} />
                      ) : (
                        <>
                          {loadingUploadFile ? (
                            <LoadingOutlined />
                          ) : (
                            <span style={{ fontSize: '12px' }}>Upload</span>
                          )}
                        </>
                      )}
                    </>
                  )}
                  {editPack.urlImage && (
                    <img src={editPack.urlImage} alt="avatar" style={{ maxWidth: '200px' }} />
                  )}
                </Upload>
              </Form.Item>
            </Form>
            <Button htmlType="submit" key="submit" loading={loadingUpdateSignature} form="myForm">
              Save
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
}
export default EditSignatoryModal;
