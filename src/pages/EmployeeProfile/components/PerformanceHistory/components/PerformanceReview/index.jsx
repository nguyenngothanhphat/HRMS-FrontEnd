import React, { PureComponent, Fragment } from 'react';
import { Card, Row, Col } from 'antd';
import { formatMessage, connect } from 'umi';

import PerformanceReviewIndicator from './components/PerformanceReviewIndicator';
import styles from './index.less';

@connect(
  ({ employeeProfile: { originData: { employmentData: { manager = {} } = {} } = {} } = {} }) => ({
    manager,
  }),
)
class PerformanceReview extends PureComponent {
  renderTypePerformanceReview = (level) => {
    if (level === 2) {
      return (
        <span role="img" aria-label="icon-smile-face">
          Room to improve 😄
        </span>
      );
    }
    if (level === 3) {
      return (
        <span role="img" aria-label="icon-hammer">
          Budding ⚒️
        </span>
      );
    }
    if (level === 4) {
      return (
        <span role="img" aria-label="icon-diamond">
          Nice 💎
        </span>
      );
    }
    return (
      <span role="img" aria-label="icon-fire">
        Woah 🔥
      </span>
    );
  };

  render() {
    const { manager: { generalInfo: { firstName = '', lastName = '' } = {} } = {} } = this.props;
    const fullName = firstName + lastName;

    const dummyData = [
      {
        id: 1,
        label: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.performanceReview.date',
        }),
        value: '12th Dec 2020',
      },
      {
        id: 2,
        label: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.performanceReview.reportingTo',
        }),
        value: fullName,
      },
      {
        id: 3,
        label: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.performanceReview.collaboration_teamwork',
        }),
        value: {
          level: 4,
        },
      },
      {
        id: 4,
        label: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.performanceReview.problemSolving',
        }),
        value: {
          level: 5,
        },
      },
      {
        id: 5,
        label: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.performanceReview.decisionMaking',
        }),
        value: {
          level: 3,
        },
      },
      {
        id: 6,
        label: formatMessage({
          id: 'pages.employeeProfile.performanceHistory.performanceReview.organizing',
        }),
        value: {
          level: 2,
        },
      },
    ];
    return (
      <div className={styles.performanceReview}>
        <Card
          className={styles.performanceReview_card}
          title={formatMessage({
            id: 'pages.employeeProfile.performanceHistory.performanceReview',
          })}
        >
          <Row gutter={[16, 16]} className={styles.root}>
            {dummyData.map((item, index) => (
              <Fragment key={item.id}>
                {item.id === 1 || item.id === 2 ? (
                  <>
                    <Col span={6} className={styles.textLabel}>
                      {item.label}
                    </Col>
                    <Col span={18} className={styles.textValue}>
                      {item.value}
                    </Col>
                  </>
                ) : (
                  <>
                    <Col span={6} className={styles.textLabel}>
                      {item.label}
                    </Col>
                    <Col span={13} className={styles.performanceReview_indicator}>
                      <PerformanceReviewIndicator
                        keyIndex={`${index + 1}`}
                        level={item.value.level}
                      />
                    </Col>
                    <Col span={5} className={styles.textValue}>
                      {this.renderTypePerformanceReview(item.value.level)}
                    </Col>
                  </>
                )}
              </Fragment>
            ))}
          </Row>
        </Card>
      </div>
    );
  }
}

export default PerformanceReview;
