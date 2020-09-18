import React, { PureComponent, Fragment } from 'react';
import { Card, Row, Col } from 'antd';
import styles from './index.less';

class PerformanceReview extends PureComponent {
  _renderTypePerformanceReview = (level) => {
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
    const dummyData = [
      { id: 1, label: 'Date', value: '12th Dec 2020' },
      { id: 2, label: 'Reporting to', value: 'Anil Reddy' },
      {
        id: 3,
        label: 'Collaboration & TeamWork',
        value: {
          level: 4,
        },
      },
      {
        id: 4,
        label: 'Problem solving',
        value: {
          level: 5,
        },
      },
      {
        id: 5,
        label: 'Problem solving',
        value: {
          level: 3,
        },
      },
      {
        id: 5,
        label: 'Organising and Planning',
        value: {
          level: 2,
        },
      },
    ];
    return (
      <div className={styles.performanceReview}>
        <Card className={styles.performanceReview_card} title="Performance Reviews">
          <Row gutter={[16, 16]} className={styles.root}>
            {dummyData.map((item) => (
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
                      <Row className={styles.performanceReview_marks}>
                        <Col className={styles.performanceReview_rectangle} />
                        <Col className={styles.performanceReview_rectangle} />
                        <Col className={styles.performanceReview_rectangle} />
                        <Col className={styles.performanceReview_rectangle} />
                        <Col className={styles.performanceReview_rectangle} />
                      </Row>
                    </Col>
                    <Col span={5} className={styles.textValue}>
                      {this._renderTypePerformanceReview(item.value.level)}
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
