import { Checkbox, Col, Divider, Row } from 'antd';
import React from 'react';
import classNames from 'classnames';
import styles from '@/pages/Onboarding/components/OnboardingOverview/components/OnboardTable/index.less';
import Resubmit from '@/assets/resubmit.svg';

export default function PreJoiningDocContent() {
  return (
    <div className={classNames(styles.pageBottom, styles.pageBottom__fixed)}>
      <div className={styles.doctype}>Scan and Upload</div>
      <Divider />
      <Row className={styles.content}>
        <Col span={17}>
          <Checkbox value={null} />
          <span className={styles.comment__text}>Bachelor degree of design</span>
        </Col>
        <Col span={7} className={styles.status}>
          Waiting for Submit <img alt="resubmit" src={Resubmit} />
        </Col>
        <div className={styles.checklistComment}>
          Will update later, because integer integer asced commodo est massa. Sit inecsed eget
          aenean turpis commodo ultrice viverra.
        </div>
        <Col span={17}>
          <Checkbox value={null} />
          <span className={styles.comment__text}>High school certificate</span>
        </Col>
        <Col span={7} className={styles.status}>
          Waiting <img alt="resubmit" src={Resubmit} />
        </Col>
      </Row>

      <div className={styles.doctype}>Hard Copy</div>
      <Divider />
      <Row className={styles.content}>
        <Col span={17}>
          <Checkbox value={null} />
          <span className={styles.comment__text}>Bachelor degree of design</span>
        </Col>
        <Col span={7} className={styles.status}>
          Waiting for Submit <img alt="resubmit" src={Resubmit} />
        </Col>
        <div className={styles.checklistComment}>
          Will update later, because integer integer asced commodo est massa. Sit inecsed eget
          aenean turpis commodo ultrice viverra.
        </div>
        <Col span={17}>
          <Checkbox value={null} />
          <span className={styles.comment__text}>High school certificate</span>
        </Col>
        <Col span={7} className={styles.status}>
          Waiting <img alt="resubmit" src={Resubmit} />
        </Col>
      </Row>
    </div>
  );
}
