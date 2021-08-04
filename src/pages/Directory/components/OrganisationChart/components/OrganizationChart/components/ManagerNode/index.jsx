import React, { Component } from 'react';
import styles from '@/pages/Directory/components/OrganisationChart/components/OrganizationChart/index.less';

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
    } = this.props;
    const isActive = itemSelected === idManager;
    const className = isActive ? styles.selectNode : styles.node;

    return (
      <div
        id={idManager || ''}
        className={`${styles.parentNode} ${styles.node} ${className}`}
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
        </div>
      </div>
    );
  }
}

export default ManagerNode;
