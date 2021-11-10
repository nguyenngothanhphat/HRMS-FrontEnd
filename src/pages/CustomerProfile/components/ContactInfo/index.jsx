import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Button } from 'antd';
import editIcon from '../../../../assets/edit-customField-cm.svg';
import View from './components/View';
import Edit from './components/Edit';
import styles from './index.less';

@connect(({ customerProfile: { info = {} } = {} }) => ({ info }))
class ContactInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  handleMode = () => {
    this.setState((prevState) => ({
      editing: !prevState.editing,
    }));
  };

  handleEdit = (values) => {};

  render() {
    const { info = {} } = this.props;
    const { editing } = this.state;

    return (
      <div className={styles.ContactInfo}>
        {/* header */}
        <div className={styles.contactInfoHeader}>
          <p className={styles.contactInfoHeaderTitle}>Contact Info</p>
          {!editing && (
            <p className={styles.btnEdit} onClick={this.handleMode}>
              <img src={editIcon} alt="Edit icon" />
              Edit
            </p>
          )}
        </div>
        {/* body */}

        {!editing ? (
          <div className={styles.contactInfoBody}>
            <View info={info} />
          </div>
        ) : (
          <>
            <Edit info={info} onClose={this.handleMode} />
          </>
        )}
      </div>
    );
  }
}

export default ContactInfo;
