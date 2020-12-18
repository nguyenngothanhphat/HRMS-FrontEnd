import React, { PureComponent } from 'react';
import { connect } from 'umi';
import PageContainer from '@/layouts/layout/src/PageContainer';

@connect(({ employeeSetting }) => ({
  employeeSetting,
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
      match: { params: { reId: emailCustomId = '' } = {} },
      dispatch,
    } = this.props;

    dispatch({
      type: 'employeeSetting/fetchEmailCustomInfo',
      payload: emailCustomId,
    });
  };

  render() {
    return (
      <PageContainer>
        <div>HELLO</div>
      </PageContainer>
    );
  }
}

export default EmailView;
