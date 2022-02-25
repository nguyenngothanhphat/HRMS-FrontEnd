import React, { Component } from 'react';
import { Button, Form, Input, Modal, Select } from 'antd';
// import { Button, Form, Input, Modal, message, Spin, Upload, Tooltip, Select } from 'antd';
// import { connect } from 'umi';
// import TrashIcon from '@/assets/policiesRegulations/delete.svg';
// import UploadIcon from '@/assets/policiesRegulations/upload.svg';
// import PDFIcon from '@/assets/policiesRegulations/pdf-2.svg';
// import ImageIcon from '@/assets/policiesRegulations/image_icon.png';
import styles from './index.less';

// const { Dragger } = Upload;
const { Option } = Select;
const { TextArea } = Input;
// @connect(
//   ({
//     loading,
//     policiesRegulations: { listCategory = [], listPolicy = [] } = {},
//     user: { currentUser: { employee = {} } = {} },
//   }) => ({
//     listCategory,
//     listPolicy,
//     employee,
//     loadingUploadAttachment: loading.effects['policiesRegulations/uploadFileAttachments'],
//     loadingAdd: loading.effects['policiesRegulations/addPolicy'],
//   }),
// )
class AddQuestionAnswer extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  //   componentDidMount() {
  //     const { item: { attachment: { name = '' } = {} } = {} } = this.props;
  //     if (name !== '') {
  //       this.setState({ fileName: name });
  //     }
  //   }

  //   identifyImageOrPdf = (fileName) => {
  //     const parts = fileName.split('.');
  //     const ext = parts[parts.length - 1];
  //     switch (ext.toLowerCase()) {
  //       case 'jpg':
  //       case 'jpeg':
  //       case 'svg':
  //       case 'webp':
  //       case 'tiff':
  //       case 'png':
  //         return 0;
  //       case 'pdf':
  //         return 1;
  //       case 'doc':
  //       case 'docx':
  //         return 2;

  //       default:
  //         return 0;
  //     }
  //   };

  //   handlePreview = (fileName) => {
  //     this.setState({
  //       fileName,
  //     });
  //   };

  //   beforeUpload = (file) => {
  //     const { setSizeImageMatch = () => {} } = this.props;
  //     const checkType =
  //       this.identifyImageOrPdf(file.name) === 0 || this.identifyImageOrPdf(file.name) === 1;
  //     if (!checkType) {
  //       message.error('You can only upload image and PDF file!');
  //     }
  //     const isLt5M = file.size / 1024 / 1024 < 5;
  //     if (!isLt5M) {
  //       message.error('Image must smaller than 5MB!');
  //       setSizeImageMatch(isLt5M);
  //       // this.setState({ check: isLt5M });
  //     }
  //     setTimeout(() => {
  //       setSizeImageMatch(isLt5M);
  //       // this.setState({ check: isLt5M });
  //     }, 2000);
  //     return checkType && isLt5M;
  //   };

  //   handleUpload = (file) => {
  //     const { dispatch } = this.props;

  //     const formData = new FormData();
  //     formData.append('uri', file);
  //     dispatch({
  //       type: 'policiesRegulations/uploadFileAttachments',
  //       payload: formData,
  //     }).then((resp) => {
  //       const { data = [] } = resp;
  //       const uploadedFile = data.length > 0 ? data[0] : {};
  //       const { name = '' } = file;
  //       this.setState({ uploadedFile });
  //       this.handlePreview(name);
  //     });
  //   };

  //   handleRemove = () => {
  //     this.handlePreview('');
  //   };
       
    handleCancel = () => {
      const { onClose = () => {} } = this.props;
      // this.setState({ uploadedFile: {} });
      // this.handlePreview('');
      onClose();
    };

  //   onFinish = async ({ categoryPolicy, namePolicies }) => {
  //     const { dispatch, employee: { _id = '' } = {}, onClose = () => {} } = this.props;
  //     const { uploadedFile = {} } = this.state;
  //     const attachment = {
  //       id: uploadedFile.id,
  //       name: uploadedFile.name,
  //       url: uploadedFile.url,
  //     };

  //     const payload = {
  //       employee: _id,
  //       categoryPolicy,
  //       namePolicy: namePolicies,
  //       attachment,
  //     };

  //     if (!uploadedFile || Object.keys(uploadedFile).length === 0) {
  //       message.error('Invalid file');
  //     } else {
  //       dispatch({
  //         type: 'policiesRegulations/addPolicy',
  //         payload,
  //       }).then((response) => {
  //         const { statusCode } = response;
  //         if (statusCode === 200) {
  //           onClose();
  //         }
  //       });
  //       this.setState({ uploadedFile: {}, fileName: '' });
  //     }
  //   };

  render() {
    const { visible } = this.props;
    // const { loadingUploadAttachment, loadingAdd, listCategory = [], listPolicy = [] } = this.props;
    const { loadingAdd, listCategory = [] } = this.props;
    // const { fileName = '' } = this.state;
    // const onPolicyCategories = () => {};
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Add Question</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form name="basic" id="addForm" ref={this.formRef} onFinish={this.onFinish}>
            <Form.Item
              rules={[{ required: true, message: 'Please name Categories' }]}
              label="FAQ Categories"
              name="FaqCategory"
              labelCol={{ span: 24 }}
            >
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                // onChange={onPolicyCategories}
              >
                {listCategory.map((val) => (
                  <Option value={val._id}>{val.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Question"
              name="question"
              labelCol={{ span: 24 }}
              //   rules={[
              //     { required: true, message: 'Please enter Policy Name' },
              //     () => ({
              //       validator(_, value) {
              //         const duplicate = listPolicy.find((val) => val.namePolicy === value);
              //         if (duplicate) {
              //           return Promise.reject('Policy Name is exist ');
              //         }
              //         return Promise.resolve();
              //       },
              //     }),
              //   ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Answer"
              name="answer"
              labelCol={{ span: 24 }}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.AddQuestionAnswer} ${styles.noPadding}`}
          onCancel={this.handleCancel}
          destroyOnClose
          width={696}
          footer={
            <>
              <Button className={styles.btnCancel} onClick={this.handleCancel}>
                Cancel
              </Button>
              <Button
                className={styles.btnSubmit}
                type="primary"
                form="addForm"
                key="submit"
                htmlType="submit"
                loading={loadingAdd}
              >
                Add Question
              </Button>
            </>
          }
          title={renderModalHeader()}
          centered
          visible={visible}
        >
          {renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default AddQuestionAnswer;
