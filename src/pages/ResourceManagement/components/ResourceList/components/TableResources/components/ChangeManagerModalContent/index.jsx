import { DatePicker, Form } from 'antd';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { DATE_FORMAT_MDY, DATE_FORMAT_YMD } from '@/constants/dateFormat';
import DebounceSelect from '@/components/DebounceSelect';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import styles from './index.less';

const ChangeManagerModalContent = (props) => {
  const {
    dispatch,
    employee = {},
    dataPassRow = {},
    refreshData = () => {},
    onClose = () => {},
  } = props;

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'resourceManagement/getListEmployee',
      payload: {
        name: value,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data
        .filter((x) => x._id !== employee?._id)
        .map((user) => ({
          label: user.generalInfoInfo?.legalName,
          value: user._id,
        }));
    });
  };

  const onFinish = async (values) => {
    const { effectiveDay, manager = {} } = values;
    const effectiveDate = effectiveDay && moment(effectiveDay).format(DATE_FORMAT_YMD);
    const payload = {
      effectiveDate,
      managerId: manager,
      employeeId: dataPassRow.employeeId,
      updateBy: employee._id,
    };
    dispatch({
      type: 'resourceManagement/updateManagerResource',
      payload,
    });
    refreshData();
    onClose();
  };

  return (
    <Form
      layout="vertical"
      className={styles.ChangeManagerModalContent}
      method="POST"
      id="myForm"
      onFinish={(values) => onFinish(values)}
    >
      <Form.Item
        label="Manager"
        name="manager"
        rules={[
          { required: true, message: 'Please select the manager!' },
          () => ({
            validator(_, value) {
              if (String(dataPassRow.managerId) === String(value)) {
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('Manager duplicate with current manager!');
              }
              // eslint-disable-next-line compat/compat
              return Promise.resolve();
            },
          }),
        ]}
      >
        <DebounceSelect
          placeholder="Select the new manager"
          fetchOptions={onEmployeeSearch}
          showSearch
        />
      </Form.Item>
      <Form.Item
        label="Effective Day of change"
        name="effectiveDay"
        rules={[{ required: true, message: 'Please select the effective day!' }]}
      >
        <DatePicker
          placeholder="Select the effective day"
          suffixIcon={<img src={datePickerIcon} alt="" />}
          format={DATE_FORMAT_MDY}
        />
      </Form.Item>
    </Form>
  );
};

export default connect(
  ({
    loading = {},
    resourceManagement: { employeeList = [] } = {},
    user: {
      currentUser: { employee = {} },
    },
  }) => ({
    loading: loading.effects['resourceManagement/getListEmployee'],
    employeeList,
    employee,
  }),
)(ChangeManagerModalContent);
