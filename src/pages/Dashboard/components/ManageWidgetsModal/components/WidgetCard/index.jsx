import { Checkbox, Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import previewActivity from '@/assets/dashboard/previewActivity.svg';
import previewDailyCalendar from '@/assets/dashboard/previewDailyCalendar.svg';
import previewMyapps from '@/assets/dashboard/previewMyapps.svg';
import previewTeam from '@/assets/dashboard/previewTeam.svg';
import previewTask from '@/assets/dashboard/previewTask.svg';
import previewTimesheet from '@/assets/dashboard/previewTimesheet.svg';
import styles from './index.less';

const WidgetCard = (props) => {
  const {
    item: { id = '', name = '', description = '' } = {},
    onSelectWidget = () => {},
    checked = false,
  } = props;

  const onChange = (e) => {
    const { target: { checked: checkedTemp } = {} } = e;
    onSelectWidget(id, checkedTemp);
  };
  let imagePreview = '';
  if (name === 'My Team') {
    imagePreview = previewTeam;
  }
  if (name === 'Activity Log') {
    imagePreview = previewActivity;
  }
  if (name === 'Tasks') {
    imagePreview = previewTask;
  }
  if (name === 'My Apps') {
    imagePreview = previewMyapps;
  }
  if (name === 'Timesheets') {
    imagePreview = previewTimesheet;
  }
  if (name === 'Calendar') {
    imagePreview = previewDailyCalendar;
  }
  return (
    <Col span={12} className={styles.WidgetCard}>
      <Row gutter={[16]}>
        <Col span={3}>
          <Checkbox defaultChecked={checked} onChange={onChange} />
        </Col>
        <Col span={21}>
          <div className={styles.cardContainer}>
            <div className={styles.preview}>
              <img
                src={imagePreview}
                style={{ width: '270px', height: '210px', marginTop: '-10px' }}
                alt=""
              />
            </div>
            <div className={styles.info}>
              <span className={styles.info__title}>{name}</span>
              <span className={styles.info__description}>{description}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export default connect(() => ({}))(WidgetCard);
