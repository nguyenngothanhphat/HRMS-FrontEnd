import { Form, Input } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { HELP_TYPE, HELP_TYPO } from '@/constants/helpPage';
import styles from './index.less';

const AddCategoryModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    onClose = () => {},
    dispatch,
    refreshData = () => {},
    helpPage: { categoryList = [], selectedCountry, helpType = '' } = {},
  } = props;

  const categoryName = HELP_TYPO[helpType].SETTINGS.CATEGORY.NAME;

  const handleFinish = ({ category }) => {
    dispatch({
      type: 'helpPage/addHelpCategory',
      payload: {
        category,
        country: [selectedCountry],
        type: helpType,
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
          label={`${categoryName} Name`}
          name="category"
          labelCol={{ span: 24 }}
          rules={[
            { required: true, message: `Enter the ${categoryName.toLowerCase()} name` },
            () => ({
              validator(_, value) {
                const duplicate = categoryList.find((val) => val.category === value);
                if (duplicate) {
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject(`${categoryName} name is exist`);
                }
                // eslint-disable-next-line compat/compat
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder={`Enter the ${categoryName.toLowerCase()} name`} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ helpPage }) => ({
  helpPage,
}))(AddCategoryModalContent);
