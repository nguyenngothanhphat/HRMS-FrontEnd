import React, { Component } from 'react';
import { Form, Input, Select, Modal, Button } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
@connect(
  ({
    loading,
    faqs: { listCategory = [], listFAQ = [], selectedCountry } = {},
    user: {
      currentUser: { employee: { _id: employeeId = '' } = {} } = {},
    },
  }) => ({
    loadingGetList: loading.effects['faqs/fetchListCategory'],
    loadingAddQuestion: loading.effects['faqs/addQuestion'],
    listCategory,
    employeeId,
    listFAQ,
    selectedCountry
  }),
)
class AddQuestionAnswer extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  onFinish = async ({ FaqCategory, question, answer }) => {
    const { dispatch, employeeId = '', onClose = () => {}, selectedCountry = '' } = this.props;
    dispatch({
      type: 'faqs/addQuestion',
      payload: {
        categoryId: FaqCategory,
        employeeId,
        question,
        answer,
        country: [selectedCountry]
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
    const { visible, loadingAdd, listCategory = [], listFAQ = [] } = this.props;
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
          <Form name="Add FAQ" id="addForm" ref={this.formRef} onFinish={this.onFinish}>
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
              >
                {listCategory.map((val) => (
                  <Option value={val._id}>{val.category}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Question"
              name="question"
              labelCol={{ span: 24 }}
              rules={[
                { required: true, message: 'Please enter question Name' },
                () => ({
                  validator(_, value) {
                    const duplicate = listFAQ.find((val) => val.question === value);
                    if (duplicate) {
                      return Promise.reject('Question name is exist ');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
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
