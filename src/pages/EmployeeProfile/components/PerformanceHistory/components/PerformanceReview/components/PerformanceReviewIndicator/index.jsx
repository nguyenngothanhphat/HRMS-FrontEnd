import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';

class PerformanceReviewIndicator extends PureComponent {
  constructor() {
    super();
    this.state = {
      maxPerformanceReview: 5,
    };
  }

  renderPRIndicator = (level) => {
    const { maxPerformanceReview } = this.state;
    return (
      <Row type="flex" className={styles.performanceReview_content} justify="start" align="middle">
        {Array.from(Array(level), (index) => {
          return <Col key={index} className={this.renderActiveColorPRIndicator(level)} />;
        })}
        {Array.from(Array(maxPerformanceReview - level), (index) => {
          return <Col key={index} className={this.renderBlurColorPRIndicator(level)} />;
        })}
      </Row>
    );
  };

  renderActiveColorPRIndicator = (level) => {
    let className = `${styles.performanceReview_shape}`;
    if (level === 4 || level === 5) {
      className += ` ${styles.performanceReview_woah}`;
    }
    if (level === 3) {
      className += ` ${styles.performanceReview_building}`;
    }
    if (level === 2) {
      className += ` ${styles.performanceReview_improve}`;
    }
    return className;
  };

  renderBlurColorPRIndicator = (level) => {
    let className = `${styles.performanceReview_shape}`;
    if (level === 4 || level === 5) {
      className += ` ${styles.performanceReview_woah_blur}`;
    }
    if (level === 3) {
      className += ` ${styles.performanceReview_building_blur}`;
    }
    if (level === 2) {
      className += ` ${styles.performanceReview_improve_blur}`;
    }
    return className;
  };

  render() {
    const { level } = this.props;
    return <div className={styles.performanceReviewIndicator}>{this.renderPRIndicator(level)}</div>;
  }
}
export default PerformanceReviewIndicator;
