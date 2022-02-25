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
class EditQuestionAnswer extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    // this.setState({ uploadedFile: {} });
    // this.handlePreview('');
    onClose();
  };

  render() {
    const { visible, item } = this.props;
    const { loadingAdd, listCategory = [] } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Edit Question</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form 
            name="basic" 
            id="editForm" 
            ref={this.formRef} 
            onFinish={this.onFinish}
            initialValues={{
                faqCategory: item ? item.nameCategory : '',
                question: item ? item.question : '',
                answer: 'anwser of question'
            }}
          >
            <Form.Item
              rules={[{ required: true, message: 'Please name Categories' }]}
              label="FAQ Categories"
              name="faqCategory"
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

            <Form.Item label="Question" name="question" labelCol={{ span: 24 }}>
              <Input />
            </Form.Item>
            <Form.Item label="Answer" name="answer" labelCol={{ span: 24 }}>
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </div>
      );
    };

    return (
      <>
        <Modal
          className={`${styles.EditQuestionAnswer} ${styles.noPadding}`}
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
                Save Change
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

export default EditQuestionAnswer;
