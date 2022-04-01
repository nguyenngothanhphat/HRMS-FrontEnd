import React, { Component } from 'react';
import { Form, Input, Select, Modal, Button } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
@connect(
  ({
    loading,
    faqs: { listCategory = [], selectedCountry } = {},
    user: { currentUser: { employee: { _id: employeeId = '' } = {} } = {} },
  }) => ({
    loadingGetList: loading.effects['faqs/fetchListCategory'],
    loadingUpdate: loading.effects['faqs/updateQuestion'],
    listCategory,
    employeeId,
    selectedCountry
  }),
)
class EditQuestionAnswer extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  handleFinish = ({ question = '', faqCategory = '', answer = '' }) => {
    const {
      dispatch,
      item: { id = '' } = {},
      employeeId = '',
      onClose = () => {},
      selectedCountry = ''
    } = this.props;
    dispatch({
      type: 'faqs/updateQuestion',
      payload: {
        id,
        employeeId,
        category: faqCategory,
        question,
        answer,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
        dispatch({
          type: 'faqs/fetchListFAQ',
          payload: {
            country: [selectedCountry],
          },
        });
      }
    });
  };

  render() {
    const { loadingUpdate, visible, item, listCategory = [] } = this.props;
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
            onFinish={this.handleFinish}
            initialValues={{
              faqCategory: item ? item.nameCategory : '',
              question: item ? item.question : '',
              answer: item ? item.answer : '',
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
              >
                {listCategory.map((val) => (
                  <Option value={val._id}>{val.category}</Option>
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
                form="editForm"
                key="submit"
                htmlType="submit"
                loading={loadingUpdate}
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
