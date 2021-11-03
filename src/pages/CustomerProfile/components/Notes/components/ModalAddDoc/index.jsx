/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, Form, Input, Modal, Row, Select, Upload } from 'antd';
import React, { PureComponent } from 'react';
import s from './index.less';
import upload from '../../../../../../assets/upload-icon.svg';

class ModalAddDoc extends PureComponent {
  // onChange = ({ file }) => {
  //     const { status, name, originFileObj } = file;
  //     if(status === 'done') {

  //     }
  // }

  render() {
    const { visible, closeModal } = this.props;
    const propsUpload = {
      name: 'file',
      multiple: false,
      showUploadList: false,
    };

    return (
      <Modal
        className={s.ModalAddDoc}
        visible={visible}
        title="Add Document"
        footer={[
          <div className={s.btnForm}>
            <Button className={s.btnCancel} onClick={closeModal}>
              Cancel
            </Button>
            <Button className={s.btnAdd}>Add Document</Button>
          </div>,
        ]}
        onCancel={closeModal}
      >
        <Form layout="vertical" name="addDoc">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Document Type" name="documentType">
                <Select placeholder="Enter Document Type" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Document Name" name="documentName">
                <Input placeholder="Enter Document Name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Comments (Optional)" name="comments">
            <Input.TextArea rows={6} placeholder="Enter Comments" />
          </Form.Item>
          <Upload.Dragger {...propsUpload}>
            <div className={s.content}>
              <div className={s.viewIconDownload}>
                <div className={s.viewIconDownload__circle}>
                  <img src={upload} alt="upload" />
                </div>
              </div>
              <p className={s.title}>Drag and drop your file here</p>
              <p className={s.text}>
                or <span className={s.browse}>browse</span> to upload a file
              </p>
              <p className={s.helpText}>
                File size should not be more than 25mb. Supported file for view: pdf &amp; jpeg{' '}
              </p>
            </div>
          </Upload.Dragger>
        </Form>
      </Modal>
    );
  }
}

export default ModalAddDoc;
