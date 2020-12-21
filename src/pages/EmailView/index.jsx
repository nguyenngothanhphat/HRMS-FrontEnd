/* eslint-disable no-console */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';
import PageContainer from '@/layouts/layout/src/PageContainer';
import styles from './index.less';

@connect(({ employeeSetting: { emailCustomData = {} } = {}, loading }) => ({
  emailCustomData,
  loading: loading.effects['employeeSetting/fetchEmailCustomInfo'],
}))
class EmailView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
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
    const { emailCustomData, loading } = this.props;
    const {
      // applyTo,
      message,
      // recipients,
      // sendingDate,
      subject,
      // triggerEvent: { name: triggerName = '' } = {},
    } = emailCustomData;

    return (
      <div className={styles.EmailView}>
        {loading ? (
          <div className={styles.ViewEmail_loading}>
            <Spin size="large" />
          </div>
        ) : (
          <PageContainer>
            {/* <h1>{applyTo}</h1> */}
            <h1>SUBJECT: {subject}</h1>
            {/* <h1>{sendingDate}</h1> */}
            <h1>MESSAGE: {message}</h1>
            {/* <h1>{triggerName}</h1> */}
            {/* <h1>{recipients}</h1> */}
          </PageContainer>
        )}
      </div>
    );
  }
}

export default EmailView;
