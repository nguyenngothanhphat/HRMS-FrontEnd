import React, { Component } from 'react';
import { connect } from 'umi';
import styles from '@/pages/Directory/components/OrganisationChart/components/OrganizationChart/index.less';

@connect(({ user: { currentUser: { employee: { _id: idCurrentUser = '' } = {} } = {} } = {} }) => ({
  idCurrentUser,
}))
class ManagerNode extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      manager = {},
      manager: { _id: idManager = '' } = {},
      propsState: { isCollapsed, itemSelected = '' } = {},
      renderCardInfo = () => {},
      handleCollapse = () => {},
      managerRef,
      idCurrentUser = '',
    } = this.props;
    const isActive = itemSelected === idManager;
    const isCurrentUser = idManager === idCurrentUser;

    const className = isActive ? styles.selectNode : styles.node;
    const className2 = isCurrentUser ? styles.currentUserNode : styles.parentNode;

    return (
      <div
        id={idManager || ''}
        className={`${className2} ${styles.node} ${className}`}
        ref={managerRef}
      >
        {renderCardInfo(manager, 'manager')}
        <div className={styles.node__bottom}>
          <div
            onClick={() => handleCollapse('parent')}
            className={
              isCollapsed
                ? styles.node__bottom_reporteesExpand
                : styles.node__bottom_reporteesCollapse
            }
          >
            {isCollapsed ? `- 1 reportee` : `+ 1 reportee`}
          </div>
          {isCurrentUser ? <div className={styles.node__bottom_you}>You</div> : null}
        </div>
      </div>
    );
  }
}

export default ManagerNode;
