import React, { PureComponent } from 'react';
import { history } from 'umi';
import { setToken } from '@/utils/token';

class CandidateLink extends PureComponent {
  componentDidMount = () => {
    const { match: { params: { tokenId = '' } = {} } = {} } = this.props;
    if (tokenId) {
      setToken(tokenId);
      localStorage.setItem('candidate-link-mode', true);
      history.replace('/candidate-portal');
    }
  };

  render() {
    return <div />;
  }
}
export default CandidateLink;
