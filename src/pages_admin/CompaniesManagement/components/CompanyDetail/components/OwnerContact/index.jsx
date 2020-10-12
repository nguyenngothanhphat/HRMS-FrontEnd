import React, { PureComponent } from 'react';
// import { Card, Row, Col } from 'antd';
import { formatMessage } from 'umi';
import Edit from './components/Edit';
import View from './components/View';
import styles from './index.less';

// @connect(({ companiesManagement: { editCompany: { isOpenEditDetail = false } } = {} }) => ({
//   isOpenEditDetail,
// }))
class OwnerContact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpenEditOwnerContact: false,
    };
  }

  handleEdit = () => {
    this.setState({
      isOpenEditOwnerContact: true,
    });
  };

  handleCancelEdit = () => {
    this.setState({
      isOpenEditOwnerContact: false,
    });
  };

  render() {
    const { isOpenEditOwnerContact } = this.state;

    const renderContentCompanyDetail = isOpenEditOwnerContact ? (
      <Edit handleCancelEdit={this.handleCancelEdit} />
    ) : (
      <View />
    );

    return (
      <div className={styles.ownerContact}>
        <div className={styles.spaceTitle}>
          <p className={styles.ownerContact_title}>
            {formatMessage({ id: 'pages_admin.company.ownerContact' })}
          </p>
          {isOpenEditOwnerContact ? (
            ''
          ) : (
            <div className={styles.flexEdit} onClick={this.handleEdit}>
              <img src="/assets/images/edit.svg" alt="Icon Edit" />
              <p className={styles.Edit}>Edit</p>
            </div>
          )}
        </div>

        <div className={styles.viewBottom}>{renderContentCompanyDetail}</div>
      </div>
    );
  }
}

export default OwnerContact;
