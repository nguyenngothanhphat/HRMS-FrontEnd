/* eslint-disable camelcase */
import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip, Radio } from 'antd';
import { connect } from 'umi';
import Icon, { LockFilled, UserOutlined } from '@ant-design/icons';
import { getCurrentTenant } from '@/utils/authority';
import iconQuestTion from '../../../Icon/icon';
import styles from './index.less';

@connect(
  ({
    employeeProfile: { tempData: { generalData = {} } = {}, tenantCurrentEmployee = '' } = {},
  }) => ({
    generalData,
    tenantCurrentEmployee,
  }),
)
class View extends PureComponent {
  handleChangesPrivate = (e, label) => {
    const { dispatch, generalData, tenantCurrentEmployee = '' } = this.props;
    if (label === 'Personal Number') {
      dispatch({
        type: 'employeeProfile/setPrivate',
        payload: {
          id: generalData._id,
          isShowPersonalNumber: e.target.value,
          tenantId: tenantCurrentEmployee,
        },
      });
    }
    if (label === 'Personal Email') {
      dispatch({
        type: 'employeeProfile/setPrivate',
        payload: {
          id: generalData._id,
          isShowPersonalEmail: e.target.value,
          tenantId: tenantCurrentEmployee,
        },
      });
    }
  };

  renderValue = (
    label,
    value,
    permissions,
    profileOwner,
    isShowPersonalNumber,
    isShowPersonalEmail,
  ) => {
    const blank = '_blank';
    if (label === 'Personal Number') {
      if (isShowPersonalNumber || permissions.viewPersonalNumber !== -1 || profileOwner) {
        return value;
      }
      return <LockFilled />;
    }
    if (label === 'Personal Email') {
      if (isShowPersonalEmail || permissions.viewPersonalEmail !== -1 || profileOwner) {
        return value;
      }
      return <LockFilled />;
    }
    if (label === 'Linkedin') {
      return (
        <a href={value} target={blank}>
          {value}
        </a>
      );
    }
    if (label !== 'Personal Number' && label !== 'Personal Email' && label !== 'Linkedin') {
      return value;
    }
    return null;
  };

  formatAddress = (address, country, state, zipCode) => {
    const formatAd = {
      address: address ? `${address}, ` : '',
      country: country ? `${country}, ` : '',
      zipCode: zipCode ? `${zipCode}, ` : '',
      state: state ? `${state}, ` : '',
    };
    const renderValue = `${formatAd.address}${formatAd.state}${formatAd.zipCode}${formatAd.country}`;
    return renderValue.replace(/,\s*$/, ''); // remove the last comma and spaces in string
  };

  render() {
    const { dataAPI, generalData, permissions = {}, profileOwner = false } = this.props;
    const { isShowPersonalNumber, isShowPersonalEmail } = generalData;

    const {
      residentAddress: {
        address: r_Address = '',
        country: { name: r_countryName = '' } = {},
        state: r_state = '',
        zipCode: r_zipCode = '',
      } = {},
      currentAddress: {
        address: c_Address = '',
        country: { name: c_countryName = '' } = {},
        state: c_state = '',
        zipCode: c_zipCode = '',
      } = {},
    } = dataAPI;

    const dummyData = [
      { label: 'Personal Number', value: dataAPI.personalNumber },
      { label: 'Personal Email', value: dataAPI.personalEmail },
      { label: 'Blood Group', value: dataAPI.Blood },
      { label: 'Marital Status', value: dataAPI.maritalStatus },
      { label: 'Linkedin', value: dataAPI.linkedIn },
      {
        label: 'Residence Address',
        value: this.formatAddress(r_Address, r_countryName, r_state, r_zipCode),
      },
      {
        label: 'Current Address',
        value: this.formatAddress(c_Address, c_countryName, c_state, c_zipCode),
      },
    ];
    const content =
      'The number will be still visible to your Reporting Manager, HR and Finance teams however you can Choose to keep it hidden from other co-workers by toggling the highlighted toggle switch!';
    const contentEmail =
      'The email will be still visible to your Reporting Manager, HR and Finance teams however you can Choose to keep it hidden from other co-workers by toggling the highlighted toggle switch!';

    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
              {item.label === 'Personal Number' || item.label === 'Personal Email' ? (
                <Tooltip
                  placement="top"
                  title={item.label === 'Personal Number' ? content : contentEmail}
                  overlayClassName={styles.GenPITooltip}
                  color="#568afa"
                >
                  <Icon component={iconQuestTion} className={styles.iconQuestTion} />
                </Tooltip>
              ) : (
                ''
              )}
            </Col>
            <Col
              span={16}
              className={item.label === 'Linkedin' ? styles.Linkedin : styles.textValue}
            >
              {this.renderValue(
                item.label,
                item.value,
                permissions,
                profileOwner,
                isShowPersonalNumber,
                isShowPersonalEmail,
              )}
            </Col>
            {item.label === 'Personal Number' &&
            (permissions.editPersonalInfo !== -1 || profileOwner) ? (
              <Col span={2}>
                <div className={styles.iconBox}>
                  <Radio.Group
                    defaultValue={isShowPersonalNumber}
                    buttonStyle="solid"
                    size="small"
                    className={styles.iconRadio}
                    onChange={(e) => this.handleChangesPrivate(e, item.label)}
                  >
                    <Radio.Button value={false}>
                      <LockFilled />
                    </Radio.Button>
                    <Radio.Button value>
                      <UserOutlined />
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            ) : (
              ''
            )}

            {item.label === 'Personal Email' &&
            (permissions.editPersonalInfo !== -1 || profileOwner) ? (
              <Col span={2}>
                <div className={styles.iconBox}>
                  <Radio.Group
                    defaultValue={isShowPersonalEmail}
                    buttonStyle="solid"
                    size="small"
                    className={styles.iconRadio}
                    onChange={(e) => this.handleChangesPrivate(e, item.label)}
                  >
                    <Radio.Button value={false}>
                      <LockFilled />
                    </Radio.Button>
                    <Radio.Button value>
                      <UserOutlined />
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            ) : (
              ''
            )}
          </Fragment>
        ))}
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;
