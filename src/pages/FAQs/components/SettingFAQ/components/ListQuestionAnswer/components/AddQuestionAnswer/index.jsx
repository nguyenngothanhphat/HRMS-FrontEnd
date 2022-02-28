import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import CommonModal from '../CommonModal';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
class AddQuestionAnswer extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, loadingAdd, listCategory = [], onClose = () => {} } = this.props;
    const headerName = 'Add Question';
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
          acctionName={headerName}
          modalContent={renderModalContent()}
          onClose={onClose}
        />
      </>
    );
  }
}

export default AddQuestionAnswer;
