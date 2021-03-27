import React, { Component } from 'react';
// import { Row, Col } from 'antd';
import AdditionalAdminstrator from './components/Additional';
import PrimaryAdminstrator from './components/Primary';
import AddAdmin from './components/AddAdmin';

import styles from './index.less';
import EditAdmin from './components/EditAdmin';

class Adminstrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddAdmin: false,
      isEditAdmin: false,
    };
  }

  handleAddAdmin = (value) => {
    this.setState({
      isAddAdmin: value,
    });
  };

  handleEditAdmin = (value) => {
    this.setState({
      isEditAdmin: value,
    });
  };

  render() {
    const { isAddAdmin, isEditAdmin } = this.state;
    return (
      <div className={styles.root}>
        {isAddAdmin || isEditAdmin ? (
          <>{isEditAdmin ? <EditAdmin /> : <AddAdmin handleAddAdmin={this.handleAddAdmin} />}</>
        ) : (
          <>
            <div className={styles.root__top}>
              <PrimaryAdminstrator />
            </div>
            <div className={styles.root__bottom}>
              <AdditionalAdminstrator
                handleAddAdmin={this.handleAddAdmin}
                handleEditAdmin={this.handleEditAdmin}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Adminstrator;
