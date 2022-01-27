import { Button, Form, Popover, Select, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import CloseIcon from '@/assets/projectManagement/closeX.svg';
import styles from './index.less';

const FilterPopover = (props) => {
  const [form] = Form.useForm();
  const {
    children,
    placement = 'bottom',
    onSubmit = () => {},
    dispatch,
    needResetFilterForm = false,
    setNeedResetFilterForm = () => {},
  } = props;
  const [showPopover, setShowPopover] = useState(false);

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
    if (showPopover) {
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
        type: 'projectManagement/fetchDivisionListEffect',
        payload: {
          name: 'Engineering',
        },
      });
      dispatch({
        type: 'projectManagement/fetchEmployeeListEffect',
      });
    }
  }, [showPopover]);

  const onFormSubmit = (values) => {
    const newValues = { ...values };
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
    onSubmit(result);
  };

  useEffect(() => {
    if (needResetFilterForm) {
      form.resetFields();
      setNeedResetFilterForm(false);
    }
  }, [needResetFilterForm]);

  const renderPopup = () => {
    return (
      <>
        <div className={styles.popupContainer}>
          <Form form={form} layout="vertical" name="filterForm" onFinish={onFormSubmit}>
            <Form.Item label="By Project ID" name="projectId">
              <Input placeholder="Project ID" />
            </Form.Item>
            <Form.Item label="By division" name="division">
              <Select
                allowClear
                mode="multiple"
                showSearch='true'
                optionFilterProp="children"
                style={{ width: '100%' }}
                placeholder="Select Division"
              >
                {divisionList.map((x) => {
                  return <Select.Option value={x}>{x}</Select.Option>;
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By PROJECT NAME" name="projectName">
              <Select
                allowClear
                mode="multiple"
                showSearch='true'
                optionFilterProp="children"
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
                showSearch='true'
                optionFilterProp="children"
                style={{ width: '100%' }}
                placeholder="Select Customer"
              >
                {customerList.map((x) => {
                  return <Select.Option value={x.customerId}>{x.legalName}</Select.Option>;
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By engagement type" name="engagementType">
              <Select
                allowClear
                mode="multiple"
                showSearch='true'
                optionFilterProp="children"
                style={{ width: '100%' }}
                placeholder="Select Engagement Type"
              >
                {projectTypeList.map((x) => (
                  <Select.Option value={x.id}>{x.type_name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="By PROJECT manager" name="projectManager">
              <Select
                mode="multiple"
                showSearch='true'
                optionFilterProp="children"
                style={{ width: '100%' }}
                loading={loadingFetchEmployeeList}
                placeholder="Select Project Manager"
              >
                {employeeList.map((x) => (
                  <Select.Option value={x._id}>{x?.generalInfo?.legalName}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="By status" name="projectStatus">
              <Select
                allowClear
                mode="multiple"
                showSearch='true'
                optionFilterProp="children"
                style={{ width: '100%' }}
                placeholder="Select Status"
              >
                {projectStatusList.map((x) => (
                  <Select.Option value={x.id}>{x.status}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.buttons}>
          <Button className={styles.btnClose} onClick={() => setShowPopover(false)}>
            Close
          </Button>
          <Button className={styles.btnApply} form="filterForm" htmlType="submit" key="submit">
            Apply
          </Button>
        </div>
      </>
    );
  };

  return (
    <Popover
      placement={placement}
      title={() => (
        <div className={styles.popoverHeader}>
          <span className={styles.headTitle}>Filters</span>
          <span
            className={styles.closeIcon}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPopover(false)}
          >
            <img src={CloseIcon} alt="close" />
          </span>
        </div>
      )}
      content={() => renderPopup()}
      trigger="click"
      visible={showPopover}
      overlayClassName={styles.FilterPopover}
      onVisibleChange={() => {
        setShowPopover(!showPopover);
      }}
    >
      {children}
    </Popover>
  );
};

export default connect(({ projectManagement, user: { currentUser: { employee = {} } = {} } }) => ({
  projectManagement,
  employee,
}))(FilterPopover);
