import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import Moment from 'moment';
import iconQuestTion from '../../../Icon/icon';
import styles from './index.less';

class View extends PureComponent {
  render() {
    const { dataAPI } = this.props;
    // console.log('dataAPI', dataAPI);
    const dummyData = [
      { label: 'Legal Name', value: dataAPI.legalName },
      {
        label: 'Date of Birth',
        value: dataAPI.DOB ? Moment(dataAPI.DOB).locale('en').format('Do MMM YYYY') : '',
      },
      { label: 'Legal Gender', value: dataAPI.legalGender },
      { label: 'Employee ID', value: dataAPI.employeeId },
      { label: 'Work Email', value: dataAPI.workEmail },
      { label: 'Work Number', value: dataAPI.workNumber },
      { label: 'Adhaar Card Number', value: dataAPI.cardNumber },
      { label: 'UAN Number', value: dataAPI.uanNumber },
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
