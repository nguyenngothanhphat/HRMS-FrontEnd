import React, { Component } from 'react';
import ViewPrimary from './View';
import EditPrimary from './Edit';
import styles from './index.less';

class PrimaryAdminstrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChange: false,
    };
  }

  onClickChange = () => {
    this.setState({ isChange: true });
  };

  render() {
    const { isChange } = this.state;

    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.header__title}>Primary administrator</div>
          <div className={styles.header__action} onClick={this.onClickChange}>
            Change
          </div>
        </div>

        <div className={styles.primary}>{isChange ? <EditPrimary /> : <ViewPrimary />}</div>
      </div>
    );
  }
}

export default PrimaryAdminstrator;
