import React, { Component } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    policiesRegulations: { listCategory = [], originData: { selectedCountry = '' } } = {},
  }) => ({
    loadingUpdate: loading.effects['policiesRegulations/updateCategory'],
    listCategory,
    selectedCountry,
  }),
)
class EditCategoriesModal extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  handleFinish = ({ category }) => {
    const {
      dispatch,
      onClose = () => {},
      item: { _id: id = '' } = {},
      onRefresh = () => {},
      selectedCountry = '',
    } = this.props;
    dispatch({
      type: 'policiesRegulations/updateCategory',
      payload: {
        id,
        name: category,
        country: [selectedCountry],
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onRefresh();
        onClose();
      }
    });
  };

  render() {
    const { visible, loadingUpdate, item: { name = '' } = {}, listCategory = [] } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Edit Policies Categories</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form
            initialValues={{ category: name }}
            name="basic"
            id="addForm"
            ref={this.formRef}
            onFinish={this.handleFinish}
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
                        const duplicate = listCategory.find((val) => val.name === value);
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
          className={`${styles.EditTaskModal} ${styles.noPadding}`}
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

export default EditCategoriesModal;
