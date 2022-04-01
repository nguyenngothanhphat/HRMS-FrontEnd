import { Form, Popover, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
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
      projectTypeList = [],
      projectStatusList = [],
      divisionList = [],
      employeeList = [],
      projectNameList = [],
    } = {},
    resourceManagement: { customerList = [] } = {},
    loadingFetchEmployeeList = false,
  } = props;

  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };
  const customerNewList = removeDuplicate(customerList, (item) => item?.customerName);

  useEffect(() => {
    if (showPopover) {
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
        type: 'projectManagement/fetchProjectStatusListEffect',
      });
      dispatch({
        type: 'projectManagement/fetchEmployeeListEffect',
      });
    }
  }, [showPopover]);

  const onFinish = (values) => {
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
    dispatch({
      type: 'resourceManagement/save',
      payload: {
        filter: result,
      },
    });
  };

  useEffect(() => {
    if (needResetFilterForm) {
      form.resetFields();
      setNeedResetFilterForm(false);
    }
  }, [needResetFilterForm]);

  const onFinishDebounce = debounce((values) => {
    onFinish(values);
  }, 700);

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFinishDebounce(values);
  };

  const renderPopup = () => {
    return (
      <>
        <div className={styles.popupContainer}>
          <Form form={form} layout="vertical" name="filterForm" onValuesChange={onValuesChange}>
            <Form.Item label="By Project ID" name="projectId">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select Project ID"
                showSearch
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projectNameList.map((x) => {
                  return <Select.Option value={x.projectId}>{x.projectId}</Select.Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item label="By division" name="division">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select Division"
                showSearch
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {divisionList.map((x) => {
                  return <Select.Option value={x.name}>{x.name}</Select.Option>;
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By PROJECT NAME" name="projectName">
              <Select
                allowClear
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Select Project Name"
                showSearch
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
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

            <Form.Item label="By customer" name="customerName">
              <Select
                allowClear
                mode="multiple"
                showSearch
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '100%' }}
                placeholder="Select Customer"
              >
                {customerNewList.map((x) => {
                  return <Select.Option value={x.customerName}>{x.customerName}</Select.Option>;
                })}
              </Select>
            </Form.Item>

            <Form.Item label="By engagement type" name="engagementType">
              <Select
                allowClear
                mode="multiple"
                showSearch
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '100%' }}
                placeholder="Select Engagement Type"
              >
                {projectTypeList.map((x) => (
                  <Select.Option value={x.type_name}>{x.type_name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="By PROJECT manager" name="projectManager">
              <Select
                mode="multiple"
                allowClear
                showSearch
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
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
                showSearch
                showArrow
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '100%' }}
                placeholder="Select Status"
              >
                {projectStatusList.map((x) => (
                  <Select.Option value={x.status}>{x.status}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
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

export default connect(
  ({ projectManagement, resourceManagement, user: { currentUser: { employee = {} } = {} } }) => ({
    projectManagement,
    resourceManagement,
    employee,
  }),
)(FilterPopover);
