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

  onCancel = () => {
    this.setState({ isChange: false });
  };

  render() {
    const { isChange } = this.state;
    const { permissionList = [] } = this.props;

    const listAdministrator = {
      employeeName: 'Renil Komitla',
      email: 'renil@terralogic.com',
      position: 'Renil’s permission apply to everyone in the company',
    };

    return (
      <div className={styles.administrator}>
        <div className={styles.header}>
          <div className={styles.header__title}>Primary Administrator</div>
          <div className={styles.header__action} onClick={this.onClickChange}>
            Change
          </div>
        </div>

        <div className={styles.primary}>
          {isChange ? (
            <EditPrimary onCancel={this.onCancel} listAdministrator={listAdministrator} />
          ) : (
            <ViewPrimary listAdministrator={listAdministrator} permissionList={permissionList} />
          )}
        </div>
      </div>
    );
  }
}

export default PrimaryAdminstrator;
