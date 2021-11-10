import {
  Alert,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  TimePicker,
} from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import AddIcon from '@/assets/timeSheet/add.svg';
import RemoveIcon from '@/assets/timeSheet/recycleBin.svg';
import styles from './index.less';

const { Option } = Select;

const AddProjectModal = (props) => {
  const formRef = React.createRef();
  const {
    visible = false,
    title = 'Add new Project',
    onClose = () => {},
    date = '',
    projectName = '',
    mode = 'single',
  } = props;

  const { dispatch, employee: { _id: employeeId = '' } = {} || {} } = props;

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const handleCancel = () => {
    onClose();
  };

  const refreshData = () => {
    dispatch({
      type: 'timeSheet/fetchMyTimesheetByTypeEffect',
      isRefreshing: true,
    });
  };

  // main function
  const addMultipleActivityEffect = (submitDate, tasks) => {};

  const handleFinish = async (values) => {};

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Form
          name="basic"
          ref={formRef}
          id="myForm"
          onFinish={handleFinish}
          initialValues={{
            tasks: [{ projectName: projectName || null }],
            date: date ? moment(date) : '',
          }}
        >
          <Row gutter={[24, 0]} className={styles.abovePart}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Customer' }]}
                label="Customer"
                name="customer"
                fieldKey="customer"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Customer">
                  {['A', 'B'].map((x) => (
                    <Option value={x}>{x}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Engagement Type' }]}
                label="Engagement Type"
                name="engagementType"
                fieldKey="engagementType"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Engagement Type">
                  {['A', 'B'].map((x) => (
                    <Option value={x}>{x}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Account Owner' }]}
                label="Account Owner"
                name="accountOwner"
                fieldKey="accountOwner"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Account Owner">
                  {['A', 'B'].map((x) => (
                    <Option value={x}>{x}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 0]} className={styles.middlePart}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Project ID' }]}
                label="Project ID"
                name="projectId"
                fieldKey="projectId"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Select Project ID" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Project Status' }]}
                label="Project Status"
                name="engagementType"
                fieldKey="engagementType"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Project Status">
                  {['A', 'B'].map((x) => (
                    <Option value={x}>{x}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Project Name' }]}
                label="Project Name"
                name="projectName"
                fieldKey="projectName"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Select Project Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Project Alias' }]}
                label="Project Alias (Optional)"
                name="projectAlias"
                fieldKey="projectAlias"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Select Project Alias" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Start Date' }]}
                label="Start Date"
                name="startDate"
                fieldKey="startDate"
                labelCol={{ span: 24 }}
              >
                <DatePicker placeholder="Select Start Date" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Tentative End Date' }]}
                label="Tentative End Date"
                name="tentativeEndDate"
                fieldKey="tentativeEndDate"
                labelCol={{ span: 24 }}
              >
                <DatePicker placeholder="Select Tentative End Date" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Project Owner' }]}
                label="Project Owner"
                name="projectOwner"
                fieldKey="projectOwner"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Project Owner">
                  {['A', 'B'].map((x) => (
                    <Option value={x}>{x}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={0} md={12} />

            <Col xs={24}>
              <Form.Item
                rules={[{ required: true, message: 'Enter Project Description' }]}
                label="Project Description"
                name="projectDescription"
                fieldKey="projectDescription"
                labelCol={{ span: 24 }}
              >
                <Input.TextArea autoSize={{ minRows: 4 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 0]} className={styles.belowPart}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Engineering Owner' }]}
                label="Engineering Owner"
                name="engineeringOwner"
                fieldKey="engineeringOwner"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Engineering Owner">
                  {['A', 'B'].map((x) => (
                    <Option value={x}>{x}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Division' }]}
                label="Division"
                name="division"
                fieldKey="division"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Division">
                  {['A', 'B'].map((x) => (
                    <Option value={x}>{x}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Tags' }]}
                label="Tags"
                name="tags"
                fieldKey="tags"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Groups">
                  {['A', 'B'].map((x) => (
                    <Option value={x}>{x}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={0} md={12} />
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <>
      <Modal
        className={`${styles.AddProjectModal} ${styles.noPadding}`}
        onCancel={handleCancel}
        destroyOnClose
        width={650}
        footer={
          <>
            <Button className={styles.btnCancel} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
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

export default connect(({ loading, user: { currentUser: { employee = {} } = {} } }) => ({
  employee,
  loadingAddTask: loading.effects['timeSheet/addMultipleActivityEffect'],
}))(AddProjectModal);
