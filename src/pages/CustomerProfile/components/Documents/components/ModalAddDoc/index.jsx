/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, Form, Input, Modal, Row, Select, Upload } from 'antd';
import React, { PureComponent } from 'react';
import s from './index.less';
import upload from '../../../../../../assets/upload-icon.svg';
import PDFIcon from '@/assets/pdf_icon.png';
import ImageIcon from '@/assets/image_icon.png';

class ModalAddDoc extends PureComponent {
  constructor(props) {
    super(props);
    this.refForm = React.createRef();
  }

  onAction = (file) => {
    const { action } = this.props;
    action(file);
  };

  render() {
    const {
      visible,
      closeModal,
      action,
      beforeUpload,
      onRemove,
      uploadedAttachments,
      documentType,
      fileName,
      identifyImageOrPdf,
      onAddDoc,
    } = this.props;
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
            <Button
              className={s.btnCancel}
              onClick={() => {
                closeModal();
                this.refForm.current.resetFileds();
              }}
            >
              Cancel
            </Button>
            <Button htmlType="submit" key="submit" form="addDoc" className={s.btnAdd}>
              Add Document
            </Button>
          </div>,
        ]}
        onCancel={closeModal}
      >
        <Form
          ref={this.refForm}
          layout="vertical"
          name="addDoc"
          onFinish={(values) => {
            this.refForm.current.resetFields();
            onAddDoc(values);
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Document Type" name="documentType">
                <Select placeholder="Enter Document Type">
                  {documentType.map((item) => {
                    return <Select.Option key={item.id}>{item.type_name}</Select.Option>;
                  })}
                </Select>
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
          <Form.Item name="file">
            <Upload.Dragger
              {...propsUpload}
              action={(file) => this.onAction(file)}
              beforeUpload={beforeUpload}
              onRemove={(file) => onRemove(file)}
              openFileDialogOnClick={!(uploadedAttachments.length === 2)}
            >
              {fileName !== '' ? (
                <div className={s.fileUploadedContainer}>
                  <p className={s.previewIcon}>
                    {identifyImageOrPdf(fileName) === 1 ? (
                      <img src={PDFIcon} alt="pdf" />
                    ) : (
                      <img src={ImageIcon} alt="img" />
                    )}
                  </p>
                  <p className={s.fileName}>
                    Uploaded: <a>{fileName}</a>
                  </p>
                  <Button>Choose an another file</Button>
                </div>
              ) : (
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
              )}
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default ModalAddDoc;
