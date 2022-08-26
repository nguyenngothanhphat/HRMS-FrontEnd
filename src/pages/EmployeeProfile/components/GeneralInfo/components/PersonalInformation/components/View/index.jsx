/* eslint-disable camelcase */
import Icon, { LockFilled, UserOutlined } from '@ant-design/icons';
import { Col, Radio, Row, Tooltip } from 'antd';
import React, { Fragment } from 'react';
import { connect } from 'umi';
import QuestionIcon from '../../../Icon/icon';
import styles from './index.less';

const View = (props) => {
  const {
    dispatch,
    dataAPI = {},
    isProfileOwner = false,
    employeeProfile: { employee = '' } = {},
    user: { currentUser: { employee: { _id: idEmployee = '' } = {} || {} } = {}, permissions = {} },
  } = props;

  const {
    residentAddress: {
      addressLine1: r_AddressLine1 = '',
      addressLine2: r_AddressLine2 = '',
      city: r_city = '',
      country: r_country = {},
      state: r_state = '',
      zipCode: r_zipCode = '',
    } = {},
    currentAddress: {
      addressLine1: c_AddressLine1 = '',
      addressLine2: c_AddressLine2 = '',
      city: c_city = '',
      country: c_country = {},
      state: c_state = '',
      zipCode: c_zipCode = '',
    } = {},
    isShowPersonalNumber = false,
    isShowPersonalEmail = false,
  } = dataAPI;

  const { name: r_countryName = '' } = r_country || {};
  const { name: c_countryName = '' } = c_country || {};

  const checkVisible = employee === idEmployee || permissions.editPersonalInfo !== -1;

  const formatAddress = (addressLine1, addressLine2, city, country, state, zipCode) => {
    const formatAd = {
      addressLine1: addressLine1 ? `${addressLine1}, ` : '',
      addressLine2: addressLine2 ? `${addressLine2}, ` : '',
      city: city ? `${city}, ` : '',
      country: country ? `${country}, ` : '',
      zipCode: zipCode ? `${zipCode}, ` : '',
      state: state ? `${state}, ` : '',
    };
    const renderValue = `${formatAd.addressLine1}${formatAd.addressLine2}${formatAd.city}${formatAd.state}${formatAd.zipCode}${formatAd.country}`;
    return renderValue.replace(/,\s*$/, ''); // remove the last comma and spaces in string
  };

  const data = [
    { label: 'Personal Number', value: dataAPI.personalNumber },
    { label: 'Personal Email', value: dataAPI.personalEmail },
    { label: checkVisible ? 'Blood Group' : null, value: dataAPI.Blood },
    { label: checkVisible ? 'Marital Status' : null, value: dataAPI.maritalStatus },
    { label: checkVisible ? 'Nationality' : null, value: dataAPI.nationality },
    {
      label: checkVisible ? 'Permanent Address' : null,
      value: formatAddress(
        r_AddressLine1,
        r_AddressLine2,
        r_city,
        r_countryName,
        r_state,
        r_zipCode,
      ),
    },
    {
      label: checkVisible ? 'Current Address' : null,
      value: formatAddress(
        c_AddressLine1,
        c_AddressLine2,
        c_city,
        c_countryName,
        c_state,
        c_zipCode,
      ),
    },
  ];

  const handleChangesPrivate = (e, label) => {
    if (label === 'Personal Number') {
      dispatch({
        type: 'employeeProfile/updateGeneralInfo',
        payload: {
          _id: employee,
          generalInfo: {
            isShowPersonalNumber: e.target.value,
          },
        },
      });
    }
    if (label === 'Personal Email') {
      dispatch({
        type: 'employeeProfile/updateGeneralInfo',
        payload: {
          _id: employee,
          generalInfo: {
            isShowPersonalEmail: e.target.value,
          },
        },
      });
    }
  };

  const renderValue = (label, value) => {
    if (label === 'Personal Number') {
      if (isShowPersonalNumber || permissions.viewPersonalNumber !== -1 || isProfileOwner) {
        return value;
      }
      return <LockFilled />;
    }
    if (label === 'Personal Email') {
      if (isShowPersonalEmail || permissions.viewPersonalEmail !== -1 || isProfileOwner) {
        return value;
      }
      return <LockFilled />;
    }
    if (label !== 'Personal Number' && label !== 'Personal Email') {
      return value;
    }
    return null;
  };

  const newData = data.filter((item) => item.label !== null);

  const content =
    'The number will be still visible to your Reporting Manager, HR and Finance teams however you can Choose to keep it hidden from other co-workers by toggling the highlighted toggle switch!';
  const contentEmail =
    'The email will be still visible to your Reporting Manager, HR and Finance teams however you can Choose to keep it hidden from other co-workers by toggling the highlighted toggle switch!';

  return (
    <Row gutter={[0, 16]} className={styles.root}>
      {newData.map((item) => (
        <Fragment key={item.label}>
          <Col span={6} className={styles.textLabel}>
            {item.label}
            {item.label === 'Personal Number' ||
              (item.label === 'Personal Email' && (
                <Tooltip
                  placement="top"
                  title={item.label === 'Personal Number' ? content : contentEmail}
                  overlayClassName={styles.GenPITooltip}
                  color="#568afa"
                >
                  <Icon component={QuestionIcon} className={styles.questionIcon} />
                </Tooltip>
              ))}
          </Col>
          <Col span={16} className={styles.textValue}>
            {renderValue(item.label, item.value)}
          </Col>
          {item.label === 'Personal Number' &&
            (permissions.editPersonalInfo !== -1 || isProfileOwner) && (
              <Col span={2}>
                <div className={styles.iconBox}>
                  <Radio.Group
                    value={isShowPersonalNumber}
                    buttonStyle="solid"
                    size="small"
                    className={styles.iconRadio}
                    onChange={(e) => handleChangesPrivate(e, item.label)}
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
            )}

          {item.label === 'Personal Email' &&
            (permissions.editPersonalInfo !== -1 || isProfileOwner) && (
              <Col span={2}>
                <div className={styles.iconBox}>
                  <Radio.Group
                    value={isShowPersonalEmail}
                    buttonStyle="solid"
                    size="small"
                    className={styles.iconRadio}
                    onChange={(e) => handleChangesPrivate(e, item.label)}
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
            )}
        </Fragment>
      ))}
    </Row>
  );
};

export default connect(({ employeeProfile, user }) => ({
  user,
  employeeProfile,
}))(View);
