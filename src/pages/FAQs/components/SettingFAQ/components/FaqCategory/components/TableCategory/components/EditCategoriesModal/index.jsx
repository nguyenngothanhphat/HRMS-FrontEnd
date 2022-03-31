import React, { Component } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ loading, faqs: { listCategory = [], selectedCountry } = {} }) => ({
  loadingUpdate: loading.effects['faqs/updateFAQCategory'],
  listCategory,
  selectedCountry
}))
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
    const { dispatch, onClose = () => {}, item: { id = '' } = {}, selectedCountry = '' } = this.props;
    dispatch({
      type: 'faqs/updateFAQCategory',
      payload: {
        id, 
        category,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
        dispatch({
          type: 'faqs/fetchListFAQCategory',
          payload: {
            country: [selectedCountry]
          },
        })
      }
    });
  };

  render() {
    const { visible, loadingUpdate, item: { name = '' } = {}, listCategory = [] } = this.props;
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Edit FAQ Categories</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form
            initialValues={{ category: name }}
            name="basic"
            id="editForm"
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

export default EditCategoriesModal;
