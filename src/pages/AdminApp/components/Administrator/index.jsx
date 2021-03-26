import React, { Component } from 'react';
// import { Row, Col } from 'antd';
import AdditionalAdminstrator from './components/Additional';
import PrimaryAdminstrator from './components/Primary';
import AddAdmin from './components/AddAdmin';

import styles from './index.less';

class Adminstrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddAdmin: false,
    };
  }

  handleAddAdmin = (value) => {
    this.setState({
      isAddAdmin: value,
    });
  };

  render() {
    const { isAddAdmin } = this.state;
    return (
      <div className={styles.root}>
        {isAddAdmin ? (
          <AddAdmin handleAddAdmin={this.handleAddAdmin} />
        ) : (
          <>
            <div className={styles.root__top}>
              <PrimaryAdminstrator />
            </div>
            <div className={styles.root__bottom}>
              <AdditionalAdminstrator handleAddAdmin={this.handleAddAdmin} />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Adminstrator;
