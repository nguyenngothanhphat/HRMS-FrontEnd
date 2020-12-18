import React, { PureComponent } from 'react';
import { connect } from 'umi';

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
    return <div>HELLO</div>;
  }
}

export default EmailView;
