import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const { Option } = Select;

const EditProjectStatusModalContent = (props) => {
  const {
    dispatch,
    onClose = () => {},
    onRefresh = () => {},
    selectedProject = {},
    employee = {},
  } = props;

  const { projectManagement: { projectStatusList = [] } = {} } = props;

  const formRef = React.createRef();

  const handleFinish = async (values) => {
    const res = await dispatch({
      type: 'projectManagement/updateProjectEffect',
      payload: {
        id: selectedProject.id,
        project_status: values.newStatus,
        reason_change_status: values.reason,
        userName: employee?.generalInfo?.legalName,
      },
    });
    if (res.statusCode === 200) {
      onRefresh();
      onClose();
    }
  };

  return (
    <div className={styles.EditProjectStatusModalContent}>
      <Form
        name="basic"
        ref={formRef}
        id="myForm"
        onFinish={handleFinish}
        initialValues={{
          initialStatus: selectedProject.projectStatus,
        }}
      >
        <Row gutter={[24, 0]} className={styles.abovePart}>
          <Col span={24}>
            <Form.Item label="Initial Status" name="initialStatus" labelCol={{ span: 24 }}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="New Status"
              name="newStatus"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Required field!' }]}
            >
              <Select placeholder="Select Status">
                {projectStatusList
                  .map((x) => {
                    if (x.id === selectedProject.projectStatusId) return null;
                    return (
                      <Option key={x.id} value={x.id} style={{ fontSize: '13px' }}>
                        {x.status}
                      </Option>
                    );
                  })
                  .filter((x) => x)}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Reason for change (Optional)" name="reason" labelCol={{ span: 24 }}>
              <Input.TextArea placeholder="Enter Comments" autoSize={{ minRows: 4 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default connect(({ projectManagement, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  projectManagement,
}))(EditProjectStatusModalContent);
