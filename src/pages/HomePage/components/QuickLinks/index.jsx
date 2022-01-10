import { Col, Row } from 'antd';
import React from 'react';
import CalendarIcon from '@/assets/homePage/calendar.svg';
import FAQIcon from '@/assets/homePage/faq.svg';
import HandbookIcon from '@/assets/homePage/handbook.svg';
import PoliciesIcon from '@/assets/homePage/policies.svg';
import styles from './index.less';

const links = [
  {
    id: 1,
    name: 'Policies',
    link: '#',
    type: 1, // 1: redirect link, 2: open view file modal, 3: open modal
    icon: PoliciesIcon,
  },
  {
    id: 2,
    name: 'FAQ',
    link: '#',
    type: 1,
    icon: FAQIcon,
  },
  {
    id: 1,
    name: 'Holiday Calendar',
    link: '#',
    type: 3,
    icon: CalendarIcon,
  },
  {
    id: 1,
    name: 'Employee Handbook',
    link: '#',
    type: 2,
    icon: HandbookIcon,
  },
];

const QuickLinks = () => {
  const renderLinkIcon = (item) => {
    return (
      <div className={styles.linkIcon}>
        <div className={styles.iconCircle}>
          <img src={item.icon} alt="" />
        </div>
        <span className={styles.label}>{item.name}</span>
      </div>
    );
  };

  return (
    <div className={styles.QuickLinks}>
      <p className={styles.titleText}>Quick Links</p>
      <Row gutter={[0, 16]} className={styles.links}>
        {links.map((x) => (
          <Col span={8}>{renderLinkIcon(x)}</Col>
        ))}
      </Row>
    </div>
  );
};

export default QuickLinks;
