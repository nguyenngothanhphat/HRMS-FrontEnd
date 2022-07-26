import React, { Component } from 'react';
import { Form, Select, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import datePickerIcon from '@/assets/resource-management-datepicker.svg';
import styles from './index.less';
import CommonModal from '@/components/CommonModal';

const { Option } = Select;

@connect(
  ({
    loading = {},
    resourceManagement: { employeeList = [] } = {},
    user: {
      currentUser: { employee = {} },
    },
  }) => ({
    loading: loading.effects['resourceManagement/getListEmployee'],
    loadingUpdateManager: loading.effects['resourceManagement/updateManagerResource'],
    employeeList,
    employee,
  }),
)
class ChangeManagerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.fetchListEmployee();
  };

  fetchListEmployee = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/getListEmployee',
      payload: {
        status: ['ACTIVE'],
      },
    });
  };

  handleSubmitChangeManager = async (values) => {
    const {
      dispatch,
      employee = {},
      dataPassRow = {},
      refreshData = () => {},
      onClose = () => {},
    } = this.props;
    const { effectiveDay, manager } = values;
    const effectiveDate = effectiveDay && moment(effectiveDay).format('YYYY-MM-DD');
    const payload = {
      effectiveDate,
      managerId: manager,
      employeeId: dataPassRow.employeeId,
      updateBy: employee._id
    };
    dispatch({
      type: 'resourceManagement/updateManagerResource',
      payload,
    })
    refreshData()
    onClose()
  };

  modalContent = (employeeList = []) => {
    return (
      <Form
        layout="vertical"
        className={styles.ChangeManagerModal}
        method="POST"
        id="myForm"
        onFinish={(values) => this.handleSubmitChangeManager(values)}
      >
        <Form.Item
          label="Manager"
          name="manager"
          rules={[{ required: true, message: 'Please select the manager!' }]}
        >
          <Select
            placeholder="Select the new manager"
            // onChange={(event) => this.handleOnchange(event)}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {employeeList.map((obj) => {
              return <Option value={obj._id}>{obj.generalInfo.legalName}</Option>;
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="Effective Day of change"
          name="effectiveDay"
          rules={[{ required: true, message: 'Please select the effective day!' }]}
        >
          <DatePicker
            placeholder="Select the effective day"
            suffixIcon={<img src={datePickerIcon} alt="" />}
            disabledDate={(current) => {
              const customDate = moment().format('YYYY-MM-DD');
              return current && current < moment(customDate, 'YYYY-MM-DD');
            }}
          />
        </Form.Item>
      </Form>
    );
  };

  render() {
    const { onClose = () => {}, visible, employeeList } = this.props;
    return (
      <div className={styles.Add}>
        <CommonModal
          title="Change Manager"
          secondTitle="Would you like to change the reporting manager?"
          cancelButtonType={2}
          visible={visible}
          footer={null}
          cancelText="Skip"
          onClose={onClose}
          width={440}
          content={this.modalContent(employeeList)}
          firstText="Update"
        />
      </div>
    );
  }
}

export default ChangeManagerModal;
