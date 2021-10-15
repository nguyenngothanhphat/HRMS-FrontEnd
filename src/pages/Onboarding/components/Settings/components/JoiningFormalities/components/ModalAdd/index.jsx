import { Modal, Button, Form, Input } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from '../../index.less';

const { TextArea } = Input;

const ModalAdd = (props) => {
  const { openModal, onCancel, mode, item = {}, loadingAdd, loadingUpdate, dispatch } = props;
  const [form] = Form.useForm();

  const onClickCancel = () => {
    form.resetFields();
    onCancel();
  };
  const onSubmit = async (value) => {
    let response;
    if (mode === 'add') {
      console.log('aaa');
      response = await dispatch({
        type: 'onboard/addJoiningFormalities',
        payload: value,
      });
    } else {
      const { _id } = item;
      response = await dispatch({
        type: 'onboard/updateJoiningFormalities',
        payload: {
          _id,
          ...value,
        },
      });
    }
    const { statusCode = '' } = response;
    if (statusCode === 200) onCancel();
  };

  form.setFieldsValue(item);
  return (
    <Modal
      className={styles.modalCustom}
      visible={openModal}
      onCancel={onClickCancel}
      centered
      destroyOnClose
      title={mode === 'add' ? 'Add checklist Item' : 'Edit checklist Item'}
      maskClosable={false}
      width={450}
      footer={[
        <div key="cancel" className={styles.btnCancel} onClick={onClickCancel}>
          Cancel
        </div>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          loading={loadingAdd && loadingUpdate}
          onClick={() => form.submit()}
          className={styles.btnSubmit}
        >
          {mode === 'add' ? 'Add' : 'Save Changes'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="userForm" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Item Name*"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          // rules={[
          //   {
          //     required: true,
          //   },
          // ]}
        >
          <TextArea row={5} showCount maxLength={1000} autoSize />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loadingAdd: loading.effects['onboard/addJoiningFormalities'],
  loadingUpdate: loading.effects['onboard/updateJoiningFormalities'],
}))(ModalAdd);
