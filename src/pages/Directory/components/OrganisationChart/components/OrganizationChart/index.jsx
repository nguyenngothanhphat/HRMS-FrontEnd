import React, { Component } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { isEmpty } from 'lodash';

import styles from './index.less';

@connect(
  ({
    employee: { dataOrgChart = {}, listEmployeeAll = [] } = {},
    user: { currentUser: { employee: { _id: idCurrentUser = '' } = {} } = {} } = {},
    loading,
  }) => ({
    dataOrgChart,
    idCurrentUser,
    loading: loading.effects['employee/fetchDataOrgChart'],
    loadingFetchListAll: loading.effects['employee/fetchAllListUser'],
    listEmployeeAll,
  }),
)
class OrganizationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderCardInfo = (avatar, legalName, jobTitleName, deptName, countryName) => {
    return (
      <div className={styles.node__card}>
        <Avatar className={styles.avatar} src={avatar} size={42} icon={<UserOutlined />} />
        <div className={styles.node__card__info}>
          <div className={styles.legalName}>{legalName}</div>
          <div className={styles.deptName}>{`${jobTitleName}, ${deptName}`}</div>
          <div className={styles.countryName}>{countryName}</div>
        </div>
      </div>
    );
  };

  render() {
    const { dataOrgChart, idCurrentUser = '' } = this.props;

    const {
      manager = {} || {},
      manager: { _id: idManager = '' } = {} || {},
      user: {
        _id: idUser = '',
        generalInfo: {
          avatar: userAvatar = '',
          firstName: userFirstName = '',
          middleName: userMiddleName = '',
          lastName: userLastName = '',
        } = {} || {},
        department: { name: deptName = '' } = {} || {},
        title: { name: jobTitleName = '' } = {} || {},
        location: {
          headQuarterAddress: { country: { name: countryName = '' } = {} || {} } = {} || {},
        } = {} || {},
      } = {},
      employees: listEmployees = [],
    } = dataOrgChart;
    const legalName = `${userFirstName} ${userMiddleName} ${userLastName}`;

    return (
      <div className={styles.orgChartRoot}>
        <div className={styles.orgChart}>
          {isEmpty(manager) ? null : (
            <div id={idManager || ''} className={`${styles.parentNode} ${styles.node}`}>
              parent
            </div>
          )}
          <div id={idUser} className={`${styles.userNode} ${styles.node}`}>
            {this.renderCardInfo(userAvatar, legalName, jobTitleName, deptName, countryName)}
            <div className={styles.userNode__bottom}>
              <div className={styles.userNode__bottom_reportees}>
                {`${listEmployees.length} reportees`}
              </div>
              {idUser === idCurrentUser ? (
                <div className={styles.userNode__bottom_you}>You</div>
              ) : null}
            </div>
          </div>
          <div className={styles.childrenList}>childsssss</div>
        </div>
      </div>
    );
  }
}

export default OrganizationChart;
