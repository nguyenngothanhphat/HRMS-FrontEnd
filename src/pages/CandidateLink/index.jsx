import React, { PureComponent } from 'react';
import { setToken } from '@/utils/token';
import { history } from 'umi';

class CandidateLink extends PureComponent {
  componentDidMount = () => {
    const { match: { params: { tokenId = '' } = {} } = {} } = this.props;
    if (tokenId) {
      setToken(tokenId);
      localStorage.setItem('candidate-link-mode', true);
      history.replace('/candidate');
    }
  };

  render() {
    return <div />;
  }
}
export default CandidateLink;
