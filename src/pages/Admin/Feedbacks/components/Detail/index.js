import React, { PureComponent } from 'react';
import { Form, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

@connect(
  ({
    group: { listGroup },
    type: { list: listOfType },
    bill: { filter },
    project: { listProject },
  }) => ({
    listGroup,
    listOfType,
    filter,
    listProject,
  })
)
@Form.create()
class Detail extends PureComponent {
  handleAction = action => {
    const { onCancelDetail, dispatch, itemDetail = {} } = this.props;
    dispatch({ type: 'feedback/updateFeedback', payload: { ...itemDetail, status: action } });
    if (typeof onCancelDetail === 'function') onCancelDetail();
  };

  render() {
    const { itemDetail = {} } = this.props;
    return (
      <div style={{ height: '100%' }}>
        <Row className={styles.font}>
          <Col span={8}>
            <strong>{formatMessage({ id: 'feedback.office' })} </strong>
          </Col>
          <Col span={16}>: {itemDetail.office}</Col>
        </Row>
        <Row className={styles.font}>
          <Col span={8}>
            <strong>{formatMessage({ id: 'feedback.type' })}</strong>{' '}
          </Col>
          <Col span={16}>: {itemDetail.feedbackFor}</Col>
        </Row>
        <Row className={styles.font}>
          <Col span={8}>
            <strong>{formatMessage({ id: 'feedback.status' })}</strong>{' '}
          </Col>
          <Col span={16}>: {itemDetail.status}</Col>
        </Row>
        <Row className={styles.font}>
          <Col span={8}>
            <strong>{formatMessage({ id: 'feedback.name' })}</strong>
          </Col>
          <Col span={16}>: {itemDetail.fullname}</Col>
        </Row>
        <Row className={styles.font}>
          <Col span={8}>
            <strong>{formatMessage({ id: 'feedback.email' })}</strong>{' '}
          </Col>
          <Col span={16}>: {itemDetail.email}</Col>
        </Row>
        <Row className={styles.font}>
          <Col span={8}>
            <strong>{formatMessage({ id: 'feedback.date' })}</strong>{' '}
          </Col>
          <Col span={16}>: {itemDetail.office}</Col>
        </Row>
        <Row className={styles.font}>
          <Col span={8}>
            <strong>{formatMessage({ id: 'feedback.description' })}</strong>{' '}
          </Col>
          <Col span={16}>: {itemDetail.description}</Col>
        </Row>
        {itemDetail.status === 'PENDING' && (
          <div className={styles.controlButton}>
            <Button
              className={styles.btn}
              type="primary"
              onClick={() => this.handleAction('COMPLETE')}
            >
              <FormattedMessage id="filter.btn.resolve" />
            </Button>
            <Button className={styles.btn} onClick={() => this.handleAction('REJECT')}>
              <FormattedMessage id="filter.btn.reject" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Detail;
