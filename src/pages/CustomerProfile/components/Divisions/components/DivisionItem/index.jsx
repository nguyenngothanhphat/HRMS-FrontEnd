import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import CustomEditButton from '@/components/CustomEditButton';
import styles from './index.less';

const DivisionItem = (props) => {
  const { item } = props;

  const [visible, setVisible] = React.useState(false);

  const showMoreLess = () => {
    setVisible(!visible);
  };

  const {
    divisionId = '',
    divisionName = '',
    primaryPOCName = '',
    primaryPOCNumber = '',
    primaryPOCEmail = '',
    primaryPOCDesignation = '',
    secondaryPOCName = '',
    secondaryPOCNumber = '',
    secondaryPOCEmail = '',
    secondaryPOCDesignation = '',
    addressLine1 = '',
    addressLine2 = '',
    city = '',
    state = '',
    country = '',
    postalCode = '',
  } = item;

  const items = [
    {
      name: 'Division ID',
      value: divisionId,
      default: true,
    },
    {
      name: 'Division Name',
      value: divisionName,
      default: true,
    },
    {
      name: 'Primary POC Name',
      value: primaryPOCName,
      primary: true,
    },
    {
      name: 'Primary POC Ph No.',
      value: primaryPOCNumber,
      primary: true,
    },
    {
      name: 'Primary POC Email ID',
      value: primaryPOCEmail,
      primary: true,
    },
    {
      name: 'Primary POC Designation',
      value: primaryPOCDesignation,
      primary: true,
    },
    {
      name: 'Secondary POC Name',
      value: secondaryPOCName,
      secondary: true,
    },
    {
      name: 'Secondary POC Ph No.',
      value: secondaryPOCNumber,
      secondary: true,
    },
    {
      name: 'Secondary POC Email ID',
      value: secondaryPOCEmail,
      secondary: true,
    },
    {
      name: 'Secondary POC Designation',
      value: secondaryPOCDesignation,
      secondary: true,
    },
    {
      name: 'Address Line 1',
      value: addressLine1,
      expandable: true,
    },
    {
      name: 'Address Line 2',
      value: addressLine2,
      expandable: true,
    },
    {
      name: 'City',
      value: city,
      expandable: true,
    },
    {
      name: 'State',
      value: state,
      expandable: true,
    },
    {
      name: 'Country',
      value: country,
      expandable: true,
    },
    {
      name: 'Zip/Postal Code',
      value: postalCode,
      expandable: true,
    },
  ];

  const renderCols = (x) => {
    return (
      <>
        <Col span={8}>
          <span className={styles.label}>{x.name}</span>
        </Col>
        <Col span={16}>
          <span className={styles.value}>{x.value}</span>
        </Col>
      </>
    );
  };
  return (
    <div className={styles.DivisionItem}>
      <Row gutter={[24, 16]}>
        {items
          .filter((x) => x.default)
          .map((x) => {
            return renderCols(x);
          })}
      </Row>

      <div className={styles.hasBackground}>
        <Row gutter={[24, 16]}>
          {items
            .filter((x) => x.primary)
            .map((x) => {
              return renderCols(x);
            })}
        </Row>
      </div>
      <div className={styles.hasBackground}>
        <Row gutter={[24, 16]}>
          {items
            .filter((x) => x.secondary)
            .map((x) => {
              return renderCols(x);
            })}
        </Row>
      </div>

      {visible && (
        <Row gutter={[24, 16]}>
          {items
            .filter((x) => x.expandable)
            .map((x) => {
              return renderCols(x);
            })}
        </Row>
      )}

      <div style={{ marginInline: -12, marginTop: 12 }}>
        <CustomEditButton
          icon={visible ? <MinusOutlined /> : <PlusOutlined />}
          onClick={showMoreLess}
        >
          {visible ? 'View Less' : 'View More'}
        </CustomEditButton>
      </div>
    </div>
  );
};

export default DivisionItem;
