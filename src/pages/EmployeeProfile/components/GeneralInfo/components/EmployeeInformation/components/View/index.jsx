import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import iconQuestTion from '../../../Icon/icon';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const dummyData = [
      { label: 'Legal Name', value: 'Aditya Venkatesh' },
      { label: 'Date of Birth', value: '21st May 1995' },
      { label: 'Legal Gender', value: 'Male' },
      { label: 'Employee ID', value: 'PSI 2029' },
      { label: 'Work Email', value: 'aditya@lollypop.design' },
      { label: 'Work Number', value: '+91-8900445577' },
      { label: 'Adhaar Card Number', value: '9999-0000-0000-0000' },
      { label: 'UAN Number', value: '8736456' },
    ];
    const content = 'We require your gender for legal reasons.';
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
              {item.label === 'Legal Gender' ? (
                <Tooltip
                  placement="top"
                  title={content}
                  overlayClassName={styles.GenEITooltip}
                  color="#568afa"
                >
                  <Icon component={iconQuestTion} className={styles.iconQuestTion} />
                </Tooltip>
              ) : (
                ''
              )}
            </Col>
            <Col span={18} className={styles.textValue}>
              {item.value}
            </Col>
          </Fragment>
        ))}
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;
