import { Col, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, connect } from 'umi';
import moment from 'moment';
import CalendarIcon from '@/assets/homePage/calendar.svg';
import FAQIcon from '@/assets/homePage/faq.svg';
import HandbookIcon from '@/assets/homePage/handbook.svg';
import PoliciesIcon from '@/assets/homePage/policies.svg';
import ViewDocumentModal from '@/components/ViewDocumentModal';
import styles from './index.less';
import HolidayModalContent from '@/pages/Dashboard/components/Calendar/components/HolidayModalContent';
import CommonModal from '@/components/CommonModal';

const links = [
  {
    id: 1,
    name: 'Policies',
    link: '/policies-regulations',
    type: 1, // 1: redirect link, 2: open view file modal, 3: open modal
    icon: PoliciesIcon,
  },
  {
    id: 2,
    name: 'FAQ',
    link: '/faqpage',
    type: 1,
    icon: FAQIcon,
  },
  {
    id: 1,
    name: 'Holiday Calendar',
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

const QuickLinks = (props) => {
  const [holidayModal, setHolidayModal] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const { dispatch, holidaysListByCountry = [], currentUser: { location = {} } = {} } = props;

  useEffect(() => {
    const country = location ? location.headQuarterAddress.country._id : '';
    dispatch({
      type: 'dashboard/fetchHolidaysByCountry',
      payload: {
        country,
      },
    });
  }, []);

  const filterHoliday =
    holidaysListByCountry.filter((obj) => obj.date.dateTime.year === moment().year().toString()) ||
    [];

  const onIconClick = (item) => {
    switch (item.type) {
      case 1:
        history.push(item.link);
        break;
      case 2:
        setPreviewUrl(item.link);
        setTimeout(() => {
          setPreviewModalVisible(true);
        }, 200);
        break;
      case 3:
        setHolidayModal(true);
        break;
      default:
        break;
    }
  };

  const renderLinkIcon = (item) => {
    return (
      <div className={styles.linkIcon} onClick={() => onIconClick(item)}>
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
      <Row gutter={[24, 24]} className={styles.links}>
        {links.map((x) => (
          <Col xs={24} sm={8} md={12} xl={8} lg={12} xxl={6}>
            {renderLinkIcon(x)}
          </Col>
        ))}
      </Row>
      <ViewDocumentModal
        visible={previewModalVisible}
        url={previewUrl}
        onClose={() => setPreviewModalVisible(false)}
      />
      <CommonModal
        visible={holidayModal}
        onClose={() => setHolidayModal(false)}
        title={`Holiday Calendar ${moment().year()}`}
        hasFooter={false}
        content={
          <HolidayModalContent
            visible={holidayModal}
            onClose={() => setHolidayModal(false)}
            tabKey="2"
            data={filterHoliday}
          />
        }
      />
    </div>
  );
};

export default connect(
  ({
    dashboard: { holidaysListByCountry = [] } = {},
    loading,
    user: { currentUser = {} } = {},
  }) => ({
    loadingSyncGoogleCalendar: loading.effects['dashboard/syncGoogleCalendarEffect'],
    holidaysListByCountry,
    currentUser,
    loadingHolidays: loading.effects['dashboard/fetchHolidaysByCountry'],
  }),
)(QuickLinks);
