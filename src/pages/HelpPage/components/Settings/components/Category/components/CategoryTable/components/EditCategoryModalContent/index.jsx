import { Form, Input } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const EditCategoryModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    item: { _id, category = '' } = {},
    categoryList = [],
    refreshData = () => {},
    onClose = () => {},
    dispatch,
  } = props;

  const handleFinish = (values) => {
    dispatch({
      type: 'helpPage/updateHelpCategory',
      payload: {
        id: _id,
        category: values.category,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
        refreshData();
      }
    });
  };

  return (
    <div className={styles.EditCategoryModalContent}>
      <Form
        initialValues={{ category }}
        name="basic"
        id="editForm"
        form={form}
        onFinish={handleFinish}
      >
        <Form.Item
          label="Categories Name"
          name="category"
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: 'Required field!' },
            () => ({
              validator(_, value) {
                const duplicate = categoryList.find((val) => val.name === value);
                if (duplicate) {
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Category name is exist');
                }
                // eslint-disable-next-line compat/compat
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="Enter the category name" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ helpPage: { categoryList = [], selectedCountry } = {} }) => ({
  categoryList,
  selectedCountry,
}))(EditCategoryModalContent);
