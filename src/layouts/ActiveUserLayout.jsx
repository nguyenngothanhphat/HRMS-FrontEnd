import React from 'react';
import { connect } from 'umi';

class ActiveUserLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { children } = this.props;
    return children;
  }
}

export default connect()(ActiveUserLayout);
