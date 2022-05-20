import { Col, Row } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import { CopyOutlined } from '@ant-design/icons';

@connect(({ customerProfile: { info = {} } = {} }) => ({ info }))
class View extends PureComponent {
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
        icons: <CopyOutlined />,
      },
      {
        name: 'Contact Email',
        value: contactEmail,
        icons: <CopyOutlined />,
      },
      {
        name: 'Website',
        value: website,
        icons: <CopyOutlined />,
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
      <div className={styles.View}>
        <Row>
          {items.map((val) => {
            return (
              <>
                <Col span={8}>
                  <p className={styles.label}>{val.name}</p>
                </Col>
                <Col span={8}>
                  <p className={styles.value}>{val.value}</p>
                </Col>
                <Col span={8}>
                <p style={{cursor:'pointer'}} onClick={()=> navigator.clipboard.writeText(`${val.value}`)} className={styles.icons}>{val.icons}</p>
                </Col>
              </>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default View;
