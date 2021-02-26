import React, { Component } from 'react';
import { Row, Col } from 'antd';
import PageContainer from '@/layouts/layout/src/PageContainer';
// import EmailReminderHeader from './components/EmailReminderHeader';
import EmailReminderForm from './components/EmailReminderForm';
import EmailReminderNote from './components/EmailReminderNote';

import styles from './index.less';

class CreateCustomEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <PageContainer>
        <div className={styles.CreateCustomEmail}>
          {/* <EmailReminderHeader /> */}
          <div className={styles.CreateCustomEmail_content}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} lg={17} xl={17}>
                <EmailReminderForm />
              </Col>
              <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                <EmailReminderNote />
              </Col>
            </Row>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default CreateCustomEmail;
