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
      userRef,
      renderCardInfo = () => {},
      handleCollapse = () => {},
    } = this.props;
    const {
      user: { _id: idUser = '' } = {},
      user = {},
      employees: listEmployees = [],
    } = dataOrgChart;

    const isActive = itemSelected === idUser;
    const className = isActive ? styles.selectNode : styles.node;

    return (
      <div id={idUser} className={`${styles.userNode} ${styles.node} ${className}`} ref={userRef}>
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
                ? `- ${listEmployees.length} reportees`
                : `+ ${listEmployees.length} reportees`}
            </div>
            {idUser === idCurrentUser ? <div className={styles.node__bottom_you}>You</div> : null}
          </div>
        )}
      </div>
    );
  }
}

export default UserNode;
