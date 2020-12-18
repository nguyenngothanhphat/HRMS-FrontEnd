import React, { PureComponent } from 'react';
import { connect } from 'umi';
import PageContainer from '@/layouts/layout/src/PageContainer';

@connect(({ employeeSetting: { emailCustomData = {} } = {} }) => ({
  emailCustomData,
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
    const { emailCustomData } = this.props;
    console.log('emailCustomData: ', emailCustomData);
    return (
      <PageContainer>
        <div>HELLO</div>
      </PageContainer>
    );
  }
}

export default EmailView;
