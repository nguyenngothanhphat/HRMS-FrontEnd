import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import editIcon from '../../../../assets/edit-customField-cm.svg';
import styles from './index.less';

@connect(({ customerProfile: { info = {} } = {} }) => ({ info }))
class ContactInfo extends PureComponent {
  render() {
    const {
      info: {
        contactPhone = '',
        addressLine1 = '',
        website = '',
        addressLine2 = '',
        city = '',
        state = '',
        country = '',
        postalCode = '',
        contactEmail = '',
      } = {},
    } = this.props;

    const items = [
      {
        name: 'Contact Phone',
        value: contactPhone,
      },
      {
        name: 'Contact Email',
        value: contactEmail,
      },
      {
        name: 'Website',
        value: website,
      },
      {
        name: 'Address Line 1',
        value: addressLine1,
      },
      {
        name: 'Address Line 2',
        value: addressLine2,
      },
      {
        name: 'City',
        value: city,
      },
      {
        name: 'State',
        value: state,
      },
      {
        name: 'Country',
        value: country,
      },
      {
        name: 'Zip/Postal Code',
        value: postalCode,
      },
    ];
    return (
      <div className={styles.ContactInfo}>
        {/* header */}
        <div className={styles.contactInfoHeader}>
          <p className={styles.contactInfoHeaderTitle}>Contact Info</p>
          <p className={styles.btnEdit}>
            <img src={editIcon} alt="Edit icon" />
            Edit
          </p>
        </div>
        {/* body */}
        <div className={styles.contactInfoBody}>
          <Row>
            {items.map((val) => {
              return (
                <>
                  <Col span={8}>
                    <p className={styles.label}>{val.name}</p>
                  </Col>
                  <Col span={16}>
                    <p className={styles.value}>{val.value}</p>
                  </Col>
                </>
              );
            })}
          </Row>
        </div>
      </div>
    );
  }
}

export default ContactInfo;
