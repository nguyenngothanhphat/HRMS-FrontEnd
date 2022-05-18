import { Form, Input, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import styles from './index.less';

const FilterContent = (props) => {
  const [form] = Form.useForm();
  const {
    onFilter = () => {},
    dispatch,
    needResetFilterForm = false,
    setNeedResetFilterForm = () => {},
    setIsFiltering = () => {},
    setApplied = () => {},
    projectManagement: {
      filter: {
        customerId = [],
        division = [],
        engagementType = [],
        projectId = '',
        projectManager = [],
        projectName = [],
        projectStatus = [],
      } = {},
      filter = {},
    } = {},
  } = props;

  // redux
  const {
    projectManagement: {
      customerList = [],
      projectTypeList = [],
      projectStatusList = [],
      divisionList = [],
      employeeList = [],
      projectNameList = [],
    } = {},
    loadingFetchEmployeeList = false,
  } = props;

  useEffect(() => {
    form.setFieldsValue({
      ...filter,
      customerId,
      division,
      engagementType,
      projectId,
      projectManager,
      projectName,
      projectStatus,
    });
  }, [JSON.stringify(filter)]);

  useEffect(() => {
    dispatch({
      type: 'projectManagement/fetchCustomerListEffect',
    });
    dispatch({
      type: 'projectManagement/fetchProjectNameListEffect',
    });
    dispatch({
      type: 'projectManagement/fetchProjectTypeListEffect',
    });
    dispatch({
      type: 'projectManagement/fetchProjectStatusListEffect',
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
  }, []);

  const onFormSubmit = (values) => {
    const newValues = { ...values };

    // remove empty fields
    // eslint-disable-next-line no-return-assign
    const result = Object.entries(newValues).reduce(
      // eslint-disable-next-line no-return-assign
      (a, [k, v]) =>
        v == null || v.length === 0
          ? a
          : // eslint-disable-next-line no-param-reassign
            ((a[k] = v), a),
      {},
    );
    dispatch({
      type: 'projectManagement/save',
      payload: { filter: result },
    });
    onFilter(result);
  };

  const onFinishDebounce = debounce((values) => {
    onFormSubmit(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  // clear values
  useEffect(() => {
    if (needResetFilterForm) {
      form.resetFields();
      setNeedResetFilterForm(false);
      setIsFiltering(false);
      setApplied(0);
    }
  }, [needResetFilterForm]);

  return (
    <div className={styles.FilterContent}>
      <Form form={form} layout="vertical" name="filter" onValuesChange={onValuesChange}>
        <Form.Item label="By Project ID" name="projectId">
          <Input placeholder="Project ID" />
        </Form.Item>
        <Form.Item label="By division" name="division">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Division"
          >
            {divisionList.map((x) => (
              <Select.Option value={x.name} key={x}>{x.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="By PROJECT NAME" name="projectName">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Project Name"
          >
            {projectNameList.map((item) => {
              return (
                <Select.Option value={item.projectName} key={item}>
                  {item.projectName}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item label="By customer" name="customerId">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Customer"
          >
            {customerList.map((x) => {
              return <Select.Option value={x.customerId} key={x}>{x.legalName}</Select.Option>;
            })}
          </Select>
        </Form.Item>

        <Form.Item label="By engagement type" name="engagementType">
          <Select
            allowClear
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select Engagement Type"
          >
            {projectTypeList.map((x) => (
              <Select.Option value={x.id} key={x}>{x.type_name}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="By PROJECT manager" name="projectManager">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            loading={loadingFetchEmployeeList}
            placeholder="Select Project Manager"
          >
            {employeeList.map((x) => (
              <Select.Option value={x._id} key={x}>{x?.generalInfo?.legalName}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="By status" name="projectStatus">
          <Select allowClear mode="multiple" style={{ width: '100%' }} placeholder="Select Status">
            {projectStatusList.map((x) => (
              <Select.Option value={x.id} key={x}>{x.status}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Form.Item label="By Start Date">
              <Row>
                <Col span={11}>
                  <Form.Item name="s_fromDate">
                    <DatePicker format="MMM DD, YYYY" />
                  </Form.Item>
                </Col>
                <Col span={2} className={styles.separator}>
                  <span>to</span>
                </Col>
                <Col span={11}>
                  <Form.Item name="s_toDate">
                    <DatePicker format="MMM DD, YYYY" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item label="By end date">
              <Row>
                <Col span={11}>
                  <Form.Item name="e_fromDate">
                    <DatePicker format="MMM DD, YYYY" />
                  </Form.Item>
                </Col>
                <Col span={2} className={styles.separator}>
                  <span>to</span>
                </Col>
                <Col span={11}>
                  <Form.Item name="e_toDate">
                    <DatePicker format="MMM DD, YYYY" />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item> */}
      </Form>
    </div>
  );
};

export default connect(({ projectManagement, user: { currentUser: { employee = {} } = {} } }) => ({
  projectManagement,
  employee,
}))(FilterContent);
