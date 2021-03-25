import React, { Component } from 'react';
import icon from '@/assets/add-adminstrator.svg';
import styles from './index.less';

class AdditionalAdminstrator extends Component {
    constructor(props) {
    super(props);
    this.state = {};
  }

    render() {
        return (
          <div className={styles.additional}>
            <div className={styles.header}>
              <div className={styles.header__title}>
                Additional Adminstrators
              </div>
              <div className={styles.header__action}>
                <img src={icon} alt='add-adminstrator' />
                <div className={styles.addBtn}>Add Adminstrator</div>
              </div>
            </div>
            <div>
              hello
            </div>
          </div>
        )
    }
}

export default AdditionalAdminstrator
