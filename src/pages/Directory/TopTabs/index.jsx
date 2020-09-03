import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Tab from '../Tab';

class TopTabs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      toptabs: [
        { id: 1, name: 'Directory' },
        { id: 2, name: 'Organisation Chart' },
      ],
      bottabs: [
        { id: 1, name: 'Active Employees' },
        { id: 2, name: 'My Team' },
        { id: 3, name: 'Inactive Employees' },
      ],
    };
  }

  render() {
    const { toptabs } = this.state;
    return <Tab tabs={toptabs} />;
  }
}

TopTabs.propTypes = {};

export default TopTabs;
