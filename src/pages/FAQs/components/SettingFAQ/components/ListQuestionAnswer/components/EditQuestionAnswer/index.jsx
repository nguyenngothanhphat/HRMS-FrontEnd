import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import CommonModal from '../CommonModal';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
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

  render() {
    const { loadingAdd, visible, item, listCategory = [], onClose = () => {} } = this.props;
    const headerName = 'Edit Question';
    const acctionName = 'Save Change';
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
              answer: 'answer of question',
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
        <CommonModal
          loading={loadingAdd}
          visible={visible}
          headerName={headerName}
          acctionName={acctionName}
          modalContent={renderModalContent()}
          onClose={onClose}
        />
      </>
    );
  }
}

export default EditQuestionAnswer;
