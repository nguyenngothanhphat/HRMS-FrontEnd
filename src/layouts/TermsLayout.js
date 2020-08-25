import React from 'react';
import s from './TermsLayout.less';

class TermsLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={s.container}>
        <div className={s.content}>{children}</div>
      </div>
    );
  }
}

export default TermsLayout;
