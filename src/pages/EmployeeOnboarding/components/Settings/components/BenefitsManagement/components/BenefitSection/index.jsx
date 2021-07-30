import React, { Component } from 'react';

import styles from './index.less';

class BenefitSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={styles.benefitSection}>Benefit</div>;
  }
}

export default BenefitSection;
