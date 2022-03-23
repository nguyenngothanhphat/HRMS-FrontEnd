import React, { useState } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const AddCategoriesModal = (props) => {
  const [form] = Form.useForm();
  const [disabledSave, setDisabledSave] = useState(true);
  const {
    onClose = () => {},
    onRefresh = () => {},
    selectedCountry = '',
    listCategory = [],
    loadingAdd,
    visible,
    dispatch,
  } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleFinish = ({ category }) => {
    dispatch({
      type: 'policiesRegulations/addCategory',
      payload: {
        name: category,
        country: [selectedCountry],
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onRefresh();
        onClose();
        form.resetFields();
      }
    });
  };

  const handleFormChange = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    setDisabledSave(hasErrors);
  };

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>Add Policies Categories</p>
      </div>
    );
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Form
          name="basic"
          id="addForm"
          form={form}
          onFinish={handleFinish}
          onFieldsChange={handleFormChange}
        >
          <Row>
            <Col>
              <Form.Item
                label="Categories Name"
                name="category"
                labelCol={{ span: 24 }}
                rules={[
                  { required: true, message: 'Please enter the categories name' },
                  () => ({
                    validator(_, value) {
                      const duplicate = listCategory.find(
                        (val) => val.name.replace(/\s/g, '') === value.replace(/\s/g, ''),
                      );
                      if (duplicate) {
                        return Promise.reject('Categories Name is exist ');
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };
  return (
    <>
      <Modal
        className={`${styles.AddTaskModal} ${styles.noPadding}`}
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
              form="addForm"
              key="submit"
              htmlType="submit"
              loading={loadingAdd}
              disabled={disabledSave}
            >
              Submit
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
    policiesRegulations: { listCategory = [], originData: { selectedCountry = '' } = {} } = {},
  }) => ({
    loadingAdd: loading.effects['policiesRegulations/addCategory'],
    selectedCountry,
    listCategory,
  }),
)(AddCategoriesModal);
