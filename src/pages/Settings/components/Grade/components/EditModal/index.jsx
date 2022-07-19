import { Button, Form, Input, Modal, Skeleton } from 'antd';

import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';

@connect(
  ({
    loading,
    adminSetting: {
      listEmployees = [],
      viewingGrade = {},
      tempData: { listGrades = [] } = {},
    } = {},
  }) => ({
    listGrades,
    listEmployees,
    viewingGrade,
    loadingFetchGradeList: loading.effects['adminSetting/fetchGradeList'],
    loadingFetchGradeByID: loading.effects['adminSetting/fetchGradeByID'],
    loadingAddGrade: loading.effects['adminSetting/addGrade'],
    loadingUpdateGrade: loading.effects['adminSetting/updateGrade'],
  }),
)
class EditModal extends PureComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {};

  componentDidUpdate = (prevProps) => {
    const { selectedGradeID = '' } = this.props;

    if (selectedGradeID && selectedGradeID !== prevProps.selectedGradeID) {
      this.fetchGradeByID(selectedGradeID);
    }
  };

  fetchGradeByID = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchGradeByID',
      payload: {
        id,
      },
    });
  };

  renderHeaderModal = () => {
    const { action = 'add' } = this.props;
    let title = 'Add New Grade';
    if (action === 'edit') {
      title = 'Edit Grade';
    }
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  onFinish = async (values) => {
    const { dispatch, selectedGradeID = '', onRefresh = () => {} } = this.props;
    const { name = '' } = values;

    const addGrade = async () => {
      const res = await dispatch({
        type: 'adminSetting/addGrade',
        payload: {
          name,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        this.handleCancel();
      }
    };
    const editGrade = async () => {
      const res = await dispatch({
        type: 'adminSetting/updateGrade',
        payload: {
          id: selectedGradeID,
          name,
        },
      });
      if (res.statusCode === 200) {
        onRefresh();
        this.handleCancel();
      }
    };

    const { action = '' } = this.props;
    if (action === 'add') {
      addGrade();
    }
    if (action === 'edit') {
      editGrade();
    }
  };

  handleCancel = () => {
    const { dispatch, onClose = () => {} } = this.props;
    this.formRef.current.resetFields();
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingGrade: {},
      },
    });

    onClose(false);
  };

  render() {
    const {
      visible = false,
      action = '',
      loadingFetchGradeByID = false,
      loadingUpdateGrade = false,
      loadingAddGrade = false,
      viewingGrade: { name: nameProp = '' } = {},
    } = this.props;

    return (
      <>
        <Modal
          className={styles.EditModal}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[
            <Button onClick={this.handleCancel} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              loading={loadingAddGrade || loadingUpdateGrade}
            >
              {action === 'add' ? 'Add' : 'Update'}
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          {loadingFetchGradeByID ? (
            <Skeleton paragraph={{ rows: 1 }} active />
          ) : (
            <Form
              name="basic"
              ref={this.formRef}
              id="myForm"
              onFinish={this.onFinish}
              initialValues={{
                name: nameProp,
              }}
            >
              <Form.Item
                rules={[{ required: true, message: 'Please enter grade name!' }]}
                label="Grade Name"
                name="name"
                labelCol={{ span: 24 }}
              >
                <Input />
              </Form.Item>
            </Form>
          )}
        </Modal>
      </>
    );
  }
}

export default EditModal;
