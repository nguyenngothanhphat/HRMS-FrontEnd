import React, { PureComponent } from 'react';
import { Modal, Form, Button, Select } from 'antd';
import { connect } from 'umi';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';

const { Option } = Select;

@connect(
  ({
    loading,
    locationSelection: { listLocationsByCompany = [] } = {},
    user: { currentUser = {}, companiesOfUser = [] },
    onboard: { hrList = [], filterList = {} } = {},
  }) => ({
    loadingReassign: loading.effects['onboard/reassignTicket'],
    currentUser,
    listLocationsByCompany,
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
      listLocationsByCompany = [],
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
      const currentLocationObj = listLocationsByCompany.find((loc) => loc?._id === currentLocation);
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
      type: 'onboard/fetchHRList',
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
    } = this.props;
    const { to = '' } = values;

    if (to) {
      const res = await dispatch({
        type: 'onboard/reassignTicket',
        payload: {
          id: reassignTicketId,
          tenantId: getCurrentTenant(),
          newAssignee: to,
          processStatus,
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
        firstName = '',
        middleName = '',
        lastName = '',
      } = {},
    } = hr;
    const fullName = `${firstName} ${middleName ? `${middleName} ` : ''}${lastName}`;
    return (
      <Option key={hr._id} value={hr._id} style={{ padding: '10px' }}>
        <div
          style={{
            display: 'inline',
            marginRight: '10px',
          }}
        >
          <img
            style={{
              borderRadius: '50%',
              width: '25px',
              height: '25px',
            }}
            src={avatar}
            alt="user"
            onError={(e) => {
              e.target.src = DefaultAvatar;
            }}
          />
        </div>
        <span style={{ fontSize: '13px', color: '#161C29' }} className={styles.ccEmail}>
          {fullName}
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
      // reassignTicketId = '',
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
              from: currentEmpId,
            }}
          >
            <Form.Item label="From" name="from" labelCol={{ span: 24 }}>
              <Select disabled>
                {hrList.map((hr) => {
                  return this.renderHR(hr);
                })}
              </Select>
            </Form.Item>
            <Form.Item label="To" name="to" labelCol={{ span: 24 }}>
              <Select
                // filterOption={(input, option) =>
                //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
