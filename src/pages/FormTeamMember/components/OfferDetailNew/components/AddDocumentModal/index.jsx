import AttachmentIcon from '@/assets/attachment.svg';
import ImageIcon from '@/assets/image_icon.png';
import PDFIcon from '@/assets/pdf_icon.png';
import { Button, Form, Input, message, Modal, Select, Spin, Upload } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Dragger } = Upload;

const { Option } = Select;

@connect(({ loading }) => ({ loadingUploadAttachment: loading.effects['upload/uploadFile'] }))
class AddDocumentModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {};

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 0;
    }
  };

  handlePreview = (fileName) => {
    this.setState({
      fileName,
    });
  };

  beforeUpload = (file) => {
    const { setSizeImageMatch = () => {} } = this.props;
    const checkType =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
      setSizeImageMatch(isLt5M);
      // this.setState({ check: isLt5M });
    }
    setTimeout(() => {
      setSizeImageMatch(isLt5M);
      // this.setState({ check: isLt5M });
    }, 2000);
    return checkType && isLt5M;
  };

  handleUpload = (file) => {
    const { dispatch, getResponse = () => {} } = this.props;

    const formData = new FormData();
    formData.append('uri', file);
    dispatch({
      type: 'upload/uploadFile',
      payload: formData,
    }).then((resp) => {
      const { data = [] } = resp;
      const { name = '' } = data[0];
      // getResponse(resp);
      this.handlePreview(name);
    });
  };

  renderHeaderModal = () => {
    const { titleModal = 'Add Template' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  onFinish = async (values) => {
    // const { dispatch } = this.props;
    // const res = await dispatch({
    //   type: '',
    //   payload: {},
    // });
    // if (res?.statusCode === 200) {
    // }
  };

  renderHR = (hr) => {
    return (
      <Option style={{ padding: '10px' }}>
        <div
          style={{
            display: 'inline',
            marginRight: '10px',
          }}
        />
        <span style={{ fontSize: '13px', color: '#161C29' }} className={styles.ccEmail}>
          Doc Name
        </span>
      </Option>
    );
  };

  render() {
    const { loadingUploadAttachment, visible = false, handleModalVisible = () => {} } = this.props;
    const { fileName = '' } = this.state;
    return (
      <>
        <Modal
          className={styles.AddDocumentModal}
          onCancel={() => handleModalVisible(false)}
          destroyOnClose
          footer={[
            <Button onClick={() => handleModalVisible(false)} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              // disabled={!selectedEmployee}
              // loading={loadingReassign}
            >
              Add
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          <Form
            name="basic"
            // ref={this.formRef}
            id="myForm"
            onFinish={this.onFinish}
            initialValues={
              {
                // from: currentEmpId,
              }
            }
          >
            <Form.Item label="Name" name="name" labelCol={{ span: 24 }}>
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              label="Choose From Existing Document"
              name="existingDocument"
              labelCol={{ span: 24 }}
            >
              <Select
                // filterOption={(input, option) =>
                //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                // filterOption={(input, option) => {
                //   return (
                //     option.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                //     0
                //   );
                // }}
                showSearch
                allowClear
                placeholder="Select an existing document"
                // onChange={(val) => {
                //   this.setState({
                //     selectedEmployee: val,
                //   });
                // }}
              >
                {/* {hrListFormat.map((hr) => {
                  return this.renderHR(hr);
                })} */}
              </Select>
            </Form.Item>
            <div className={styles.fileUploadForm}>
              <Dragger
                beforeUpload={this.beforeUpload}
                showUploadList={false}
                action={(file) => this.handleUpload(file)}
              >
                {fileName !== '' ? (
                  <div className={styles.fileUploadedContainer}>
                    <p className={styles.previewIcon}>
                      {this.identifyImageOrPdf(fileName) === 1 ? (
                        <img src={PDFIcon} alt="pdf" />
                      ) : (
                        <img src={ImageIcon} alt="img" />
                      )}
                    </p>
                    <p className={styles.fileName}>
                      Uploaded: <a>{fileName}</a>
                    </p>
                    <Button>Choose an another file</Button>
                  </div>
                ) : (
                  <div className={styles.drapperBlock}>
                    {loadingUploadAttachment ? (
                      <Spin />
                    ) : (
                      <div>
                        <img className={styles.uploadIcon} src={AttachmentIcon} alt="upload" />

                        <span className={styles.chooseFileText}>Choose file</span>
                        <span className={styles.uploadText}>or drop file here</span>
                      </div>
                    )}
                  </div>
                )}
              </Dragger>
            </div>
          </Form>
        </Modal>
      </>
    );
  }
}

export default AddDocumentModal;
