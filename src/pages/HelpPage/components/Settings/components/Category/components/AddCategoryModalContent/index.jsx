import { Form, Input } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const AddCategoryModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    categoryList = [],
    onClose = () => {},
    dispatch,
    selectedCountry = '',
    refreshData = () => {},
  } = props;

  const handleFinish = ({ category }) => {
    dispatch({
      type: 'helpPage/addHelpCategory',
      payload: {
        category,
        country: [selectedCountry],
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
    <div className={styles.AddCategoryModalContent}>
      <Form name="basic" id="addForm" form={form} onFinish={handleFinish}>
        <Form.Item
          label="Category Name"
          name="category"
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: 'Enter the category name' },
            () => ({
              validator(_, value) {
                const duplicate = categoryList.find((val) => val.category === value);
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
}))(AddCategoryModalContent);
