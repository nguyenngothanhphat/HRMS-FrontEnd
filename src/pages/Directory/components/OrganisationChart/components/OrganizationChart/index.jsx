import React, { Component } from 'react';
import orgChartData from './dataMock';

import styles from './index.less';

class OrganizationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(orgChartData);
    const {
      manager: { _id: idManager = '' } = {},
      currentUser: { _id: idCurrentUser = '' } = {},
      employees: listEmployees = [],
    } = orgChartData;
    return (
      <div className={styles.orgChartRoot}>
        <div className={styles.orgChart}>
          <div id={idManager} className={styles.parentNode}>
            parent
          </div>
          <div id={idCurrentUser} className={styles.currentNode}>
            current
          </div>
          <div className={styles.childrenNode}>child</div>
        </div>
      </div>
    );
  }
}

export default OrganizationChart;
