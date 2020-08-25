import React, { PureComponent } from 'react';
import s from './index.less';

class Demo extends PureComponent {
  render() {
    const { text, src } = this.props;
    return (
      <div className={s.containerView}>
        <p className={s.textContent}>{text}</p>
        <iframe
          src={src}
          frameBorder="0"
          allowFullScreen
          title="Videos Demo"
          height="100%"
          className={s.video}
        />
      </div>
    );
  }
}

export default Demo;
