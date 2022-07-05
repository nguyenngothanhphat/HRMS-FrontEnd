import { Col, DatePicker, Form, Input, Row, Select, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import CreatableSelect from 'react-select/creatable';
import HelpIcon from '@/assets/projectManagement/help.svg';
import CalendarIcon from '@/assets/projectManagement/calendar.svg';
import styles from './index.less';

const dateFormat = 'MM-DD-YYYY';
const { Option } = Select;

const AddProjectModal = (props) => {
  const [form] = Form.useForm();
  const { visible = false, onClose = () => {}, dispatch } = props;
  const [customerId, setCustomerId] = useState('');

  // redux
  const {
    projectManagement: {
      customerList = [],
      projectTypeList = [],
      projectStatusList = [],
      tagList = [],
      skillList = [],
      divisionList = [],
      employeeList = [],
      newProjectId = '',
      customerInfo: { accountOwnerId = '' },
    } = {},
    employee: { generalInfo: { legalName: ownerName = '' } = {} } = {} || {},
    loadingGenId = false,
    loadingFetchEmployeeList = false,
    loadingFetchCustomerList = false,
    loadingFetchCustomerInfo = false,
  } = props;

  const tagListDefault = tagList.map((x) => ({ ...x, name: x.tag_name }));
  const allSkillList = tagListDefault
    .concat(skillList)
    .filter(
      (v, i, a) =>
        a.findIndex(
          (item) =>
            item.name.replace(/\s/g, '').toLowerCase() === v.name.replace(/\s/g, '').toLowerCase(),
        ) === i,
    );

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
        type: 'projectManagement/fetchSkillListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchDivisionListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchEmployeeListEffect',
      });
    }
  }, [visible]);

  useEffect(() => {
    form.setFieldsValue({
      projectId: newProjectId.toUpperCase(),
    });
  }, [newProjectId]);

  useEffect(() => {
    form.setFieldsValue({
      accountOwner: accountOwnerId || null,
    });
  }, [accountOwnerId]);

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
      dispatch({
        type: 'projectManagement/fetchCustomerInfo',
        payload: {
          customerId,
        },
      });
    }
  }, [customerId]);

  useEffect(() => {
    return () => {
      setCustomerId('');
      dispatch({
        type: 'projectManagement/save',
        payload: {
          customerInfo: {},
          newProjectId: '',
        },
      });
    };
  }, []);

  const handleCancel = () => {
    form.resetFields();
    // clear generated project id in redux
    dispatch({
      type: 'projectManagement/save',
      payload: {
        newProjectId: '',
      },
    });
    setCustomerId('');
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
    const name = values.tags.map((item) => {
      return item.label;
    });
    const res = await dispatch({
      type: 'projectManagement/addProjectEffect',
      payload: {
        ...values,
        startDate: moment(values.startDate).format('YYYY-MM-DD'),
        tentativeEndDate: moment(values.tentativeEndDate).format('YYYY-MM-DD'),
        customerName: customer?.legalName,
        ownerName,
        tags: name,
      },
    });
    if (res.statusCode === 200) {
      handleCancel();
      refreshData();
    }
  };

  return (
    <div className={styles.AddProjectModalContent}>
      <Form name="myForm" form={form} id="myForm" onFinish={handleFinish}>
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
                loading={loadingFetchCustomerList || loadingGenId || loadingFetchCustomerInfo}
                placeholder="Select Customer"
                disabled={loadingGenId}
                onChange={(val) => setCustomerId(val)}
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onClear={() => form.setFieldsValue({ projectId: null, accountOwner: null })}
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
              <Select
                placeholder="Select Engagement Type"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projectTypeList.map((x) => (
                  <Option value={x.id}>{x.type_name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Account Owner"
              name="accountOwner"
              fieldKey="accountOwner"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: 'Select Account Owner' }]}
            >
              <Select placeholder="Account Owner" disabled loading={loadingFetchCustomerInfo}>
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
              <Input disabled placeholder="Project ID (auto generate)" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              rules={[{ required: true, message: 'Select Project Status' }]}
              label={
                <span>
                  Project Status
                  <Tooltip placement="rightBottom" title="Some texts here">
                    <img src={HelpIcon} alt="" />
                  </Tooltip>
                </span>
              }
              name="projectStatus"
              fieldKey="projectStatus"
              labelCol={{ span: 24 }}
            >
              <Select
                placeholder="Select Project Status"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
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
              <Select
                loading={loadingFetchEmployeeList}
                placeholder="Select Project Manager"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
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
              rules={[
                {
                  pattern: /^[0-9]*([.][0-9]{1})?$/,
                  message: 'Value must be a number or float number',
                },
              ]}
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
              rules={[
                {
                  pattern: /^[0-9]*([.][0-9]{1})?$/,
                  message: 'Value must be a number or float number',
                },
              ]}
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
              rules={[
                {
                  pattern: /^[0-9]*([.][0-9]{1})?$/,
                  message: 'Value must be a number or float number',
                },
              ]}
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
              <Select
                loading={loadingFetchEmployeeList}
                placeholder="Select Engineering Owner"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
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
              <Select
                placeholder="Select Division"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {divisionList.map((x) => (
                  <Option value={x.name}>{x.name}</Option>
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
              {/* <Select
                mode="multiple"
                placeholder="Select Groups"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {tagList.map((x) => (
                  <Option value={x.tag_name}>{x.tag_name}</Option>
                ))}
              </Select> */}
              <CreatableSelect
                menuPlacement="top"
                isMulti
                options={allSkillList?.map((item) => {
                  return {
                    label: item.name,
                    value: item.name,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col xs={0} md={12} />
        </Row>
      </Form>
    </div>
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
    loadingFetchCustomerInfo: loading.effects['projectManagement/fetchCustomerInfo'],
  }),
)(AddProjectModal);
