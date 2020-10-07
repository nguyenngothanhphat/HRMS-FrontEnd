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
    // const companyDetail = [
    //   {
    //     id: 1,
    //     label: 'Company Name',
    //     value: 'Terralogic',
    //   },
    //   {
    //     id: 2,
    //     label: 'Company Logo',
    //     value: 'Terralogic',
    //   },
    //   {
    //     id: 3,
    //     label: 'DBA',
    //     value: 'DBA',
    //   },
    //   {
    //     id: 4,
    //     label: 'EIN',
    //     value: 'EIN',
    //   },
    //   {
    //     id: 5,
    //     label: 'Head Quarter Add',
    //     value: 'Head Quarter Add',
    //   },
    //   {
    //     id: 6,
    //     label: 'Work Location',
    //     value: 'Work Location',
    //   },
    //   {
    //     id: 7,
    //     label: 'Employee Number',
    //     value: 'Employee Number',
    //   },
    //   {
    //     id: 8,
    //     label: 'Owner Contact',
    //     value: 'Terralogic',
    //   },
    //   {
    //     id: 9,
    //     label: 'License',
    //     value: 'License',
    //   },
    //   {
    //     id: 10,
    //     label: 'Payment',
    //     value: 'Payment',
    //   },
    // ];

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
