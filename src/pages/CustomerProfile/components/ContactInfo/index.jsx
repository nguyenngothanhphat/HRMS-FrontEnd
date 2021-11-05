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
            <Col span={12}>
              <p>Contact Phone</p>
            </Col>
            <Col span={12}>
              <p> {contactPhone} </p>
            </Col>

            <Col span={12}>
              <p>Contact Email</p>
            </Col>
            <Col span={12}>
              <p>{contactEmail}</p>
            </Col>

            <Col span={12}>
              <p>Website</p>
            </Col>
            <Col span={12}>
              <p>{website}</p>
            </Col>

            <Col span={12}>
              <p>Address Line 1</p>
            </Col>
            <Col span={12}>
              <p>{addressLine1}</p>
            </Col>

            <Col span={12}>
              <p>Address Line 1</p>
            </Col>
            <Col span={12}>
              <p>{addressLine1}</p>
            </Col>

            <Col span={12}>
              <p>Address Line 2</p>
            </Col>
            <Col span={12}>
              <p>{addressLine2}</p>
            </Col>

            <Col span={12}>
              <p>City</p>
            </Col>
            <Col span={12}>
              <p>{city}</p>
            </Col>

            <Col span={12}>
              <p>State</p>
            </Col>
            <Col span={12}>
              <p>{state}</p>
            </Col>

            <Col span={12}>
              <p>Country</p>
            </Col>
            <Col span={12}>
              <p>{country}</p>
            </Col>

            <Col span={12}>
              <p>Zip/Postal Code</p>
            </Col>
            <Col span={12}>
              <p>{postalCode}</p>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default ContactInfo;
