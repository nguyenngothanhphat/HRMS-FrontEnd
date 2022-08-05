import { Form, Input, Spin } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const EditModalContent = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    selectedGradeID = '',
    visible = false,
    action = '',
    loadingFetchGradeByID = false,
    viewingGrade: { name: nameProp = '' } = {},
    viewingGrade = {},
    onRefresh = () => {},
    onClose = () => {},
  } = props;

  const fetchGradeByID = (id) => {
    dispatch({
      type: 'adminSetting/fetchGradeByID',
      payload: {
        id,
      },
    });
  };

  useEffect(() => {
    if (selectedGradeID && visible) {
      fetchGradeByID(selectedGradeID);
    }
  }, [selectedGradeID]);

  useEffect(() => {
    form.setFieldsValue({
      name: nameProp,
    });
  }, [JSON.stringify(viewingGrade)]);

  const handleDone = () => {
    form.resetFields();
    dispatch({
      type: 'adminSetting/save',
      payload: {
        viewingGrade: {},
      },
    });

    onClose(false);
  };

  const onFinish = async (values) => {
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
        handleDone();
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
        handleDone();
      }
    };

    if (action === 'add') {
      addGrade();
    }
    if (action === 'edit') {
      editGrade();
    }
  };

  return (
    <>
      <div className={styles.EditModalContent}>
        <Spin spinning={loadingFetchGradeByID}>
          <Form name="basic" form={form} id="myForm" onFinish={onFinish}>
            <Form.Item
              rules={[{ required: true, message: 'Please enter grade name!' }]}
              label="Grade Name"
              name="name"
              labelCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </>
  );
};

export default connect(
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
)(EditModalContent);
