import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'umi';
import PageContainer from '@/layouts/layout/src/PageContainer';
import EditEmailHeader from './components/EditEmailHeader';
import EditEmailForm from './components/EditEmailForm';
import EditEmailNote from './components/EditEmailNote';

import styles from './index.less';

@connect(({ employeeSetting: { emailCustomData = {} } = {}, loading }) => ({
  loadingfetchEmailCustomInfo: loading.effects['employeeSetting/fetchEmailCustomInfo'],
  emailCustomData,
}))
class EditEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    const {
      match: { params: { reId: id = '' } = {} },
      dispatch,
    } = this.props;

    dispatch({
      type: 'employeeSetting/fetchEmailCustomInfo',
      payload: id,
    });
  };

  render() {
    const { emailCustomData } = this.props;

    return (
      <PageContainer>
        <div className={styles.EditEmail}>
          <EditEmailHeader />
          <div className={styles.EditEmail_content}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={24} md={24} lg={17} xl={17}>
                <EditEmailForm emailCustomData={emailCustomData} />
              </Col>
              <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                <EditEmailNote />
              </Col>
            </Row>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default EditEmail;
