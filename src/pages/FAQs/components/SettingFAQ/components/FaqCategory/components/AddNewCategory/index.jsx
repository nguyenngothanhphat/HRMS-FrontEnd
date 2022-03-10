import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, Modal, Row } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ loading, faqs: { listCategory = [] } = {} }) => ({
  loadingAdd: loading.effects['faqs/addFAQCategory'],
  listCategory,
}))
class AddNewCategory extends PureComponent {
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
    const { onClose = () => {}, dispatch } = this.props;
    dispatch({
      type: 'faqs/addFAQCategory',
      payload: {
        category,
      },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        onClose();
      }
    });
  };

  render() {
    const { visible, listCategory } = this.props;
    console.log('listCategory', listCategory)
    const renderModalHeader = () => {
      return (
        <div className={styles.header}>
          <p className={styles.header__text}>Add Category</p>
        </div>
      );
    };
    const renderModalContent = () => {
      return (
        <div className={styles.content}>
          <Form name="basic" id="addForm" ref={this.formRef} onFinish={this.handleFinish}>
            <Row>
              <Col>
                <Form.Item
                  label="Category Name"
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
          className={`${styles.AddTaskModal} ${styles.noPadding}`}
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
                // loading={loadingAdd}
              >
                Add Category
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

export default AddNewCategory;
