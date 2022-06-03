import React, { PureComponent } from 'react';
import { Modal, Form, Button, Select, Input } from 'antd';
import { connect } from 'umi';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    location: { companyLocationList = [] } = {},
    user: { currentUser = {}, companiesOfUser = [] },
    onboard: { hrList = [], filterList = {} } = {},
  }) => ({
    loadingReassign: loading.effects['onboard/reassignTicket'],
    currentUser,
    companyLocationList,
    companiesOfUser,
    filterList,
    hrList,
  }),
)
class ReassignModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { selectedEmployee: '' };
  }

  componentDidMount = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'onboard/fetchFilterList',
      payload: {
        tenantId: getCurrentTenant(),
        id: getCurrentCompany(),
      },
    });
    this.fetchListEmployee();
  };

  renderHeaderModal = () => {
    const { titleModal = 'Re-assign Employee' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{titleModal}</p>
      </div>
    );
  };

  fetchListEmployee = () => {
    const { dispatch } = this.props;
    const {
      companiesOfUser = [],
      filterList: { listCountry = [] } = {},
      companyLocationList = [],
    } = this.props;
    const currentCompany = getCurrentCompany();
    const currentLocation = getCurrentLocation();

    const companyPayload = companiesOfUser.filter((lo) => lo?._id === currentCompany);
    let locationPayload = [];

    if (!currentLocation) {
      locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listCountry.forEach(
          ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
            if (countryItem1 === countryItem2) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      });
    } else {
      const currentLocationObj = companyLocationList.find((loc) => loc?._id === currentLocation);
      const currentLocationCountry = currentLocationObj?.headQuarterAddress?.country?._id;
      const currentLocationState = currentLocationObj?.headQuarterAddress?.state;

      locationPayload = listCountry.map(({ country: { _id: countryItem1 = '' } = {} }) => {
        let stateList = [];
        listCountry.forEach(
          ({ country: { _id: countryItem2 = '' } = {}, state: stateItem2 = '' }) => {
            if (
              countryItem1 === countryItem2 &&
              currentLocationCountry === countryItem2 &&
              currentLocationState === stateItem2
            ) {
              stateList = [...stateList, stateItem2];
            }
          },
        );
        return {
          country: countryItem1,
          state: stateList,
        };
      });
    }
    dispatch({
      type: 'onboard/fetchEmployeeList',
      payload: {
        company: companyPayload,
        department: ['HR'],
        location: locationPayload,
      },
    });
  };

  onFinish = async (values) => {
    const {
      handleReassignModal = () => {},
      reassignTicketId = '',
      processStatus = '',
      dispatch,
      type = '',
      page = '',
      limit = '',
    } = this.props;
    const { to = '' } = values;
    if (to) {
      const res = await dispatch({
        type: 'onboarding/reassignTicket',
        payload: {
          id: reassignTicketId,
          tenantId: getCurrentTenant(),
          newAssignee: to,
          processStatus,
          isAll: type === 'ALL',
          page,
          limit,
        },
      });
      if (res?.statusCode === 200) {
        handleReassignModal(false);
      }
    }
  };

  renderHR = (hr) => {
    const {
      generalInfo: {
        avatar = '',
        // workEmail = '',
        legalName = '',
      } = {},
    } = hr;

    return (
      <Option key={hr._id} value={hr._id} style={{ padding: '10px' }}>
        <div
          style={{
            display: 'inline-block',
            marginRight: '10px',
            width: 25,
            height: 25,
          }}
        >
          <img
            style={{
              width: 25,
              height: 25,
              objectFit: 'cover',
              borderRadius: '50%',
            }}
            src={avatar}
            alt="user"
            onError={(e) => {
              e.target.src = DefaultAvatar;
            }}
          />
        </div>
        <span style={{ fontSize: '13px', color: '#161C29' }} className={styles.ccEmail}>
          {legalName}
        </span>
      </Option>
    );
  };

  render() {
    const {
      visible = false,
      handleReassignModal = () => {},
      hrList = [],
      currentEmpId = '',
      currentEmpName = '',
      loadingReassign = false,
    } = this.props;
    const { selectedEmployee } = this.state;
    const hrListFormat = hrList.filter((hr) => hr._id !== currentEmpId);

    return (
      <>
        <Modal
          className={styles.ReassignModal}
          onCancel={() => handleReassignModal(false, '', '')}
          destroyOnClose
          footer={[
            <Button onClick={() => handleReassignModal(false, '', '')} className={styles.btnCancel}>
              Cancel
            </Button>,
            <Button
              className={styles.btnSubmit}
              type="primary"
              form="myForm"
              key="submit"
              htmlType="submit"
              disabled={!selectedEmployee}
              loading={loadingReassign}
            >
              Add
            </Button>,
          ]}
          title={this.renderHeaderModal()}
          centered
          visible={visible}
        >
          <Form
            name="basic"
            // ref={this.formRef}
            id="myForm"
            onFinish={this.onFinish}
            initialValues={{
              from: currentEmpName,
            }}
          >
            <Form.Item label="From" name="from" labelCol={{ span: 24 }}>
              <Input disabled />
            </Form.Item>
            <Form.Item label="To" name="to" labelCol={{ span: 24 }}>
              <Select
                filterOption={(input, option) => {
                  return (
                    option.children[1].props.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  );
                }}
                showSearch
                allowClear
                placeholder="Select an employee"
                onChange={(val) => {
                  this.setState({
                    selectedEmployee: val,
                  });
                }}
              >
                {hrListFormat.map((hr) => {
                  return this.renderHR(hr);
                })}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default ReassignModal;
