import React, { Component } from 'react';
import { connect } from 'umi';
import styles from '@/pages/Directory/components/OrganisationChart/components/OrganizationChart/index.less';

@connect(({ user: { currentUser: { employee: { _id: idCurrentUser = '' } = {} } = {} } = {} }) => ({
  idCurrentUser,
}))
class UserNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      dataOrgChart,
      propsState: { isCollapsedChild, itemSelected } = {},
      idCurrentUser,
      renderCardInfo = () => {},
      handleCollapse = () => {},
    } = this.props;
    const {
      user: { _id: idUser = '' } = {},
      user = {},
      employees: listEmployees = [],
    } = dataOrgChart;

    const isActive = itemSelected === idUser;
    const isCurrentUser = idUser === idCurrentUser;
    const listActiveEmployee = listEmployees.filter((item) => item.status === 'ACTIVE');

    const className = isActive ? styles.selectNode : styles.node;
    const className2 = isCurrentUser ? styles.currentUserNode : styles.userNode;

    return (
      <div id={idUser} className={`${className2} ${styles.node} ${className}`}>
        {renderCardInfo(user, 'user')}
        {listEmployees.length === 0 ? null : (
          <div className={styles.node__bottom}>
            <div
              onClick={() => handleCollapse('user')}
              className={
                isCollapsedChild
                  ? styles.node__bottom_reporteesExpand
                  : styles.node__bottom_reporteesCollapse
              }
            >
              {isCollapsedChild
                ? `- ${listActiveEmployee.length} reportees`
                : `+ ${listActiveEmployee.length} reportees`}
            </div>
            {isCurrentUser ? <div className={styles.node__bottom_you}>You</div> : null}
          </div>
        )}
        {isCurrentUser && listEmployees.length === 0 ? (
          <div className={styles.node__bottom_you2}>You</div>
        ) : null}
      </div>
    );
  }
}

export default UserNode;
