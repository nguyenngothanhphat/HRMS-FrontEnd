import { Card, Col, Row } from 'antd';
import React from 'react';
import icon1 from '@/assets/offboadingIcon1.svg';
import icon2 from '@/assets/offboadingIcon2.svg';
import icon3 from '@/assets/offboadingIcon3.svg';
import CustomBlueButton from '@/components/CustomBlueButton';
import styles from './index.less';

const array = [
  {
    icon: icon1,
    description: <p>Discuss your decision with your Skip-level manager</p>,
  },
  {
    icon: icon2,
    description: (
      <p>
        Make sure you are done with your current project to have this discussion continued. If not,
        please{' '}
        <span style={{ color: '#2C6DF9', fontWeight: '500', borderBottom: '1px solid #2C6DF9' }}>
          {' '}
          schedule a meeting{' '}
        </span>
        with project manager now.
      </p>
    ),
  },
  {
    icon: icon3,
    description: (
      <p>
        We have prepared an
        <span style={{ color: '#2C6DF9', fontWeight: '500', borderBottom: '1px solid #2C6DF9' }}>
          {' '}
          exit checklist,{' '}
        </span>{' '}
        which you might want to see before applying for a relationship termination
      </p>
    ),
  },
];

const ThingToConsider = () => {
  const renderItem = (render) => {
    return (
      <>
        <Col span={4}>
          <div className={styles.icon}>
            <img src={render.icon} alt="iconCheck" />
          </div>
        </Col>
        <Col span={20}>
          <div className={styles.description}>{render.description}</div>
        </Col>
      </>
    );
  };

  const handleSchedule = () => {
    window.open('https://calendar.google.com/', '_blank');
  };

  return (
    <Card title="Few thing to consider" className={styles.ThingToConsider}>
      <div className={styles.container}>
        <div className={styles.items}>
          <Row justify="space-between" gutter={[24, 16]}>
            {array.map((render) => renderItem(render))}
          </Row>
        </div>
        <div className={styles.bottom}>
          <CustomBlueButton onClick={handleSchedule}>Speak to manager</CustomBlueButton>
        </div>
      </div>
    </Card>
  );
};

export default ThingToConsider;
