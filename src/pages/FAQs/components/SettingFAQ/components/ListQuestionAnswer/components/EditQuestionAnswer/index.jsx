import { Button, Form, Input, Modal, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const EditQuestionAnswer = (props) => {
  const { Option } = Select;
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const {
    dispatch,
    item: { id = '', question = '', nameCategory = '', answer = '' } = {},
    employeeId = '',
    onClose = () => {},
    selectedCountry = '',
    loadingUpdate = false,
    visible = false,
    listCategory = [],
  } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleFinish = ({ question: quest = '', faqCategory = '', answer: newAnswer = '' }) => {
    dispatch({
      type: 'faqs/updateQuestion',
      payload: {
        id,
        employeeId,
        category: faqCategory,
        question: quest,
        answer: newAnswer,
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
          form={form}
          onFinish={handleFinish}
          initialValues={{
            faqCategory: nameCategory,
            question,
            answer,
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
        onCancel={handleCancel}
        destroyOnClose
        width={696}
        footer={
          <>
            <Button className={styles.btnCancel} onClick={handleCancel}>
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
};

export default connect(
  ({
    loading,
    faqs: { listCategory = [], selectedCountry } = {},
    user: { currentUser: { employee: { _id: employeeId = '' } = {} } = {} },
  }) => ({
    loadingGetList: loading.effects['faqs/fetchListCategory'],
    loadingUpdate: loading.effects['faqs/updateQuestion'],
    listCategory,
    employeeId,
    selectedCountry,
  }),
)(EditQuestionAnswer);
