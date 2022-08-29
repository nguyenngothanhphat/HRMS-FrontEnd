import { Avatar, Col, message, Popover, Row, Spin, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import { connect, Link } from 'umi';
import { CopyTwoTone } from '@ant-design/icons';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import SearchIcon from '@/assets/searchOrgChart.svg';
import DebounceSelect from '@/components/DebounceSelect';
import { getLinkedInUrl } from '@/utils/directory';
import { getCurrentTimeOfTimezoneOption, getTimezoneViaCity } from '@/utils/times';
import { getCurrentCompanyObj } from '@/utils/utils';
import styles from './index.less';

const DetailEmployeeChart = (props) => {
  const [value, setValue] = React.useState(null); // to clear the search input
  const {
    dispatch,
    chartDetails = {},
    onClose = () => {},
    setSelectedId = () => {},
    loadingFetchOrgChart = false,
  } = props;
  const checkObj = !isEmpty(chartDetails);

  const {
    generalInfo: {
      avatar = '',
      legalName = '',
      workEmail = '',
      employeeId = '',
      workNumber = '',
      userId = '',
      linkedIn = '',
    } = {},
    department: { name: deptName = '' } = {},
    title: { name: titleName = '' } = {},
    employeeType: { name: employeeTypeName = '' } = {} || {},
    location: { headQuarterAddress = {} } = {},
  } = chartDetails;

  const { state = '', country = {} } = headQuarterAddress || {};

  const popupImage = (ava) => {
    return (
      <div className={styles.avatarPopup}>
        <img
          src={ava || DefaultAvatar}
          alt="avatar"
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
        />
      </div>
    );
  };

  const onEmployeeSearch = (val) => {
    if (!val) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }
    return dispatch({
      type: 'globalData/fetchEmployeeListEffect',
      payload: {
        name: val,
        status: ['ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfo?.legalName,
        value: user._id,
        userId: user.generalInfo?.userId,
        employeeId: user.employeeId,
        avatar: user.generalInfo?.avatar,
      }));
    });
  };

  const renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Popover
            placement="rightTop"
            content={() => popupImage(avatar || DefaultAvatar)}
            trigger="hover"
          >
            <Avatar
              style={{ cursor: 'pointer' }}
              src={
                <img
                  src={avatar || DefaultAvatar}
                  alt=""
                  onError={(e) => {
                    e.target.src = DefaultAvatar;
                  }}
                />
              }
            />
          </Popover>
        </div>
        <div className={styles.information}>
          {legalName && legalName.length > 30 ? (
            <span>
              <Tooltip title={legalName}>
                <span className={styles.name}>{`${legalName.substr(0, 30)}...`}</span>
              </Tooltip> 
              {userId ? `(${userId})` : ''}
            </span>
          ) : (
            <span className={styles.name}>{legalName || ''} {userId ? `(${userId})` : ''}</span>
          )}
          <span className={styles.position}>
            {titleName}, {deptName}
          </span>
          <span className={styles.department}>
            {employeeId}, {employeeTypeName}
          </span>
        </div>
      </div>
    );
  };

  const userInfo = () => {
    const getTimezone = getTimezoneViaCity(state) || getTimezoneViaCity(country?.name) || '';
    const timezone =
      getTimezone !== '' ? getTimezone : Intl.DateTimeFormat().resolvedOptions().timeZone;
    const time = getCurrentTimeOfTimezoneOption(new Date(), timezone);
    const emailId = 'Email id';
    const items = [
      {
        label: 'Mobile',
        value: workNumber,
        copy: true,
      },
      {
        label: emailId,
        value: workEmail,
        copy: true,
      },
      {
        label: 'Location',
        value: [state, country?.name].filter(Boolean).join(', '),
      },
      {
        label: 'Local Time',
        value: time,
      },
    ];

    return (
      <div className={styles.userInfo}>
        {items.map((i) => (
          <Row className={styles.eachRow} gutter={[16, 16]}>
            <Col className={styles.eachRow__label} span={8}>
              {i.label}:
            </Col>
            <Col className={styles.eachRow__value} span={i.copy && i.value ? 14 : 16}>
              {i.value && i.value.length > 25 && i.label === emailId
                ? `${i.value.substr(0, 25)}...`
                : i.value}
            </Col>
            <Col className={styles.eachRow__value} span={i.copy && i.value ? 2 : 0}>
              <Tooltip title="Copy" placement="right">
                <CopyTwoTone
                  onClick={() => {
                    // eslint-disable-next-line compat/compat
                    navigator.clipboard.writeText(i.value);
                    message.success('Copied to clipboard');
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
        ))}
      </div>
    );
  };

  const linkedInLink = getLinkedInUrl(linkedIn);

  return (
    <div className={styles.DetailEmployeeChart}>
      <div className={styles.chartSearch}>
        <div className={styles.chartSearch__name} onClick={checkObj ? onClose : null}>
          {getCurrentCompanyObj()?.name}
        </div>
        <DebounceSelect
          placeholder="Search by Employee Name or ID"
          fetchOptions={onEmployeeSearch}
          value={value}
          onChange={(val) => {
            setSelectedId(val || null);
            setValue(null);
          }}
          optionType={1}
        />
      </div>
      {checkObj && (
        <Spin spinning={loadingFetchOrgChart} indicator={null}>
          <div className={styles.popupContainer}>
            {renderHeader()}
            <div className={styles.divider} />
            {userInfo()}
            <div className={styles.divider} />
            <div className={styles.viewFullProfile}>
              <div className={styles.left}>
                <Link to={`/directory/employee-profile/${userId}`}>View full profile</Link>
              </div>
              <div className={styles.right}>
                <Tooltip title="Message">
                  <a href="https://chat.google.com" target="_blank" rel="noreferrer">
                    <img
                      src="/assets/images/messageIcon.svg"
                      alt="img-arrow"
                      style={{ cursor: 'pointer' }}
                    />
                  </a>
                </Tooltip>
                <Tooltip title="Email">
                  <a href={`mailto:${workEmail}`}>
                    <img
                      src="/assets/images/iconMail.svg"
                      alt="img-mail"
                      style={{ cursor: 'pointer' }}
                    />
                  </a>
                </Tooltip>
                <Tooltip
                  title={
                    linkedIn
                      ? 'LinkedIn'
                      : 'Please update the Linkedin Profile in the Employee profile page'
                  }
                >
                  {linkedIn ? (
                    <a
                      href={linkedInLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        pointerEvents: linkedIn ? 'auto' : 'none',
                      }}
                    >
                      <img
                        src="/assets/images/iconLinkedin.svg"
                        alt="img-arrow"
                        style={linkedIn ? { cursor: 'pointer' } : { cursor: 'default' }}
                      />
                    </a>
                  ) : (
                    <img
                      src="/assets/images/iconLinkedin.svg"
                      alt="img-arrow"
                      style={linkedIn ? { cursor: 'pointer' } : { cursor: 'default' }}
                    />
                  )}
                </Tooltip>
              </div>
            </div>
          </div>
        </Spin>
      )}
    </div>
  );
};

export default connect(
  ({
    employee: { listEmployeeAll = [] } = {},
    user: { companiesOfUser = [] } = {},
    location: { companyLocationList = [] } = {},
    loading,
  }) => ({
    listEmployeeAll,
    companiesOfUser,
    companyLocationList,
    loadingFetchOrgChart: loading.effects['employee/fetchDataOrgChart'],
  }),
)(DetailEmployeeChart);
