import React, { useState } from 'react';
import { Card, Dropdown, Menu, Button, Modal } from 'antd';
import SmallDownArrow from '@/assets/smallDropdownGray.svg';
import DownLoadIcon from '@/assets/employeeProfile/DownLoadIcon.svg';
import PayDetail from '../CompensationSummary/component/PayDetail';
import styles from './index.less';

const dummyData = [
  { month: 'August', grossPay: '6,400,000', deductions: '90,999', netPay: '5,500,000' },
  { month: 'July', grossPay: '6,400,000', deductions: '90,999', netPay: '5,500,000' },
  { month: 'June', grossPay: '6,400,000', deductions: '90,999', netPay: '5,500,000' },
  { month: 'May', grossPay: '6,400,000', deductions: '90,999', netPay: '5,500,000' },
  { month: 'Aprill', grossPay: '6,400,000', deductions: '90,999', netPay: '5,500,000' },
];
const PaySlips = () => {
  const [filterMode, setFilterMode] = useState('2021');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderFilterMode = () => {
    if (filterMode === '2021') return '2021';
    return '2022';
  };

  const onClick = ({ key }) => {
    setFilterMode(key);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="2021">2020</Menu.Item>
      <Menu.Item key="2021">2021</Menu.Item>
      <Menu.Item key="2022">2022</Menu.Item>
    </Menu>
  );

  const renderOption = () => {
    return (
      <Dropdown overlay={menu}>
        <div className={styles.options} onClick={(e) => e.preventDefault()}>
          <span>{renderFilterMode()}</span>

          <img src={SmallDownArrow} alt="" />
        </div>
      </Dropdown>
    );
  };
  const renderPayslips = () => {
    return dummyData.map((val) => {
      return (
        <div className={styles.containerPayslips}>
          <div className={styles.containerPayslips__month}>{val.month}</div>
          <div className={styles.containerPayslips__detail}>
            <div className={styles.detail__left}>
              <span>Gross Pay: (+) ₹</span>
              <span>{val.grossPay}</span>
              <span> | </span>
              <span>Deductions: (-) ₹ </span>
              <span>{val.deductions}</span>
              <span> | </span>
              <span> Net Pay: ₹ </span>
              <span>{val.netPay}</span>
            </div>
            <div className={styles.detail__right}>
              <Button className={styles.btnView} onClick={showModal}>
                View
              </Button>
              <img src={DownLoadIcon} alt="icon" />
            </div>
          </div>
        </div>
      );
    });
  };
  return (
    <Card title="Pay Slips" extra={renderOption()} className={styles.PaySlips}>
      {renderPayslips()}
      <Modal
        title="Pay Slip - August"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={796}
      >
        <PayDetail />
      </Modal>
    </Card>
  );
};

export default PaySlips;
