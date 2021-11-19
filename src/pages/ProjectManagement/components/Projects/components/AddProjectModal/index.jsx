import { Button, Col, DatePicker, Form, Input, Modal, Tooltip, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import CalendarIcon from '@/assets/projectManagement/calendar.svg';
import HelpIcon from '@/assets/projectManagement/help.svg';
import styles from './index.less';

const dateFormat = 'MM-DD-YYYY';
const { Option } = Select;

const AddProjectModal = (props) => {
  const [form] = Form.useForm();
  const { visible = false, title = 'Add new Project', onClose = () => {}, dispatch } = props;
  const [customerId, setCustomerId] = useState('');

  // redux
  const {
    projectManagement: {
      customerList = [],
      projectTypeList = [],
      projectStatusList = [],
      tagList = [],
      divisionList = [],
      employeeList = [],
      newProjectId = '',
    } = {},
    employee: { generalInfo: { legalName: ownerName = '' } = {} } = {} || {},
    // loadingGenId = false,
    loadingAddProject = false,
    loadingFetchEmployeeList = false,
    loadingFetchCustomerList = false,
  } = props;

  useEffect(() => {
    if (visible) {
      dispatch({
        type: 'projectManagement/fetchCustomerListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchProjectTypeListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchTagListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchDivisionListEffect',
        payload: {
          name: 'Engineering',
        },
      });
      dispatch({
        type: 'projectManagement/fetchEmployeeListEffect',
      });
    }
  }, [visible]);

  useEffect(() => {
    form.setFieldsValue({
      projectId: newProjectId,
    });
  }, [newProjectId]);

  useEffect(() => {
    const find = customerList.find((x) => x.customerId === customerId);
    if (find) {
      dispatch({
        type: 'projectManagement/generateProjectIdEffect',
        payload: {
          customerId,
          customerName: find?.legalName,
        },
      });
    }
  }, [customerId]);

  const { employee: { _id: employeeId = '' } = {} || {} } = props;

  const renderModalHeader = () => {
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  const handleCancel = () => {
    form.resetFields();
    // clear generated project id in redux
    dispatch({
      type: 'projectManagement/save',
      payload: {
        newProjectId: '',
      },
    });
    onClose();
  };

  // main function
  const refreshData = () => {
    dispatch({
      type: 'projectManagement/refreshProjectList',
    });
  };

  const handleFinish = async (values) => {
    const customer = customerList.find((x) => x.customerId === customerId);
    const res = await dispatch({
      type: 'projectManagement/addProjectEffect',
      payload: {
        ...values,
        startDate: moment(values.startDate).format('YYYY-MM-DD'),
        tentativeEndDate: moment(values.tentativeEndDate).format('YYYY-MM-DD'),
        customerName: customer?.legalName,
        ownerName,
      },
    });
    if (res.statusCode === 200) {
      handleCancel();
      refreshData();
    }
  };

  const renderModalContent = () => {
    return (
      <div className={styles.content}>
        <Form
          name="basic"
          form={form}
          id="myForm"
          onFinish={handleFinish}
          initialValues={{
            accountOwner: employeeId,
          }}
        >
          <Row gutter={[24, 0]} className={styles.abovePart}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Customer' }]}
                label="Customer"
                name="customerId"
                fieldKey="customerId"
                labelCol={{ span: 24 }}
              >
                <Select
                  loading={loadingFetchCustomerList}
                  placeholder="Select Customer"
                  onChange={(val) => setCustomerId(val)}
                >
                  {customerList.map((x) => (
                    <Option value={x.customerId}>{x.legalName}</Option>
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
                  {projectTypeList.map((x) => (
                    <Option value={x.id}>{x.type_name}</Option>
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
                <Select
                  loading={loadingFetchEmployeeList}
                  disabled
                  placeholder="Select Account Owner"
                >
                  {employeeList.map((x) => (
                    <Option value={x._id}>{x?.generalInfo?.legalName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 0]} className={styles.middlePart}>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Project ID' }]}
                label={
                  <span>
                    Project ID{' '}
                    <Tooltip placement="rightBottom" title="Some texts here">
                      <img src={HelpIcon} alt="" />
                    </Tooltip>
                  </span>
                }
                name="projectId"
                fieldKey="projectId"
                labelCol={{ span: 24 }}
              >
                <Input disabled placeholder="Project ID" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Project Status' }]}
                label={
                  <span>
                    Project Status{' '}
                    <Tooltip placement="rightBottom" title="Some texts here">
                      <img src={HelpIcon} alt="" />
                    </Tooltip>
                  </span>
                }
                name="projectStatus"
                fieldKey="projectStatus"
                labelCol={{ span: 24 }}
              >
                <Select placeholder="Select Project Status">
                  {projectStatusList.map((x) => (
                    <Option value={x.id}>{x.status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Enter Project Name' }]}
                label="Project Name"
                name="projectName"
                fieldKey="projectName"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Enter Project Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Project Alias (Optional)"
                name="projectAlias"
                fieldKey="projectAlias"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Enter Project Alias" />
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
                <DatePicker
                  format={dateFormat}
                  placeholder="Select Start Date"
                  suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
                />
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
                <DatePicker
                  format={dateFormat}
                  placeholder="Select Tentative End Date"
                  suffixIcon={<img src={CalendarIcon} alt="" className={styles.calendarIcon} />}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                rules={[{ required: true, message: 'Select Project Manager' }]}
                label="Project Manager"
                name="projectManager"
                fieldKey="projectManager"
                labelCol={{ span: 24 }}
              >
                <Select loading={loadingFetchEmployeeList} placeholder="Select Project Manager">
                  {employeeList.map((x) => (
                    <Option value={x._id}>{x?.generalInfo?.legalName}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Estimation (Man Months)"
                name="estimation"
                fieldKey="estimation"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Enter Estimation" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Billable Head Count"
                name="billableHeadCount"
                fieldKey="billableHeadCount"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Enter Billable Head Count" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Buffer Head Count"
                name="bufferHeadCount"
                fieldKey="bufferHeadCount"
                labelCol={{ span: 24 }}
              >
                <Input placeholder="Enter Buffer Head Count" />
              </Form.Item>
            </Col>

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
                <Select loading={loadingFetchEmployeeList} placeholder="Select Engineering Owner">
                  {employeeList.map((x) => (
                    <Option value={x._id}>{x?.generalInfo?.legalName}</Option>
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
                  {divisionList.map((x) => (
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
                <Select mode="multiple" placeholder="Select Groups">
                  {tagList.map((x) => (
                    <Option value={x.tag_name}>{x.tag_name}</Option>
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
              loading={loadingAddProject}
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
  ({ projectManagement = {}, loading, user: { currentUser: { employee = {} } = {} } }) => ({
    employee,
    projectManagement,
    loadingGenId: loading.effects['projectManagement/generateProjectIdEffect'],
    loadingAddProject: loading.effects['projectManagement/addProjectEffect'],
    loadingFetchEmployeeList: loading.effects['projectManagement/fetchEmployeeListEffect'],
    loadingFetchCustomerList: loading.effects['projectManagement/fetchCustomerListEffect'],
  }),
)(AddProjectModal);
