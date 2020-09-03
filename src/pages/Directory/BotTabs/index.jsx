import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import Tab from '../Tab';

class BotTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bottabs: [
        { id: 1, name: 'Active Employees' },
        { id: 2, name: 'My Team' },
        { id: 3, name: 'Inactive Employees' },
      ],
    };
  }

  render() {
    const { bottabs } = this.state;
    return <Tab tabs={bottabs} />;
  }
}

BotTab.propTypes = {};

export default BotTab;
