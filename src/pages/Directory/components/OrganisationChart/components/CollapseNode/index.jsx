import React, { Component } from 'react';
import styles from './index.less';

class CollapseNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childHeight: 0,
    };

    this.content = React.createRef();
    this.oldRef = { current: { clientHeight: 0 } };
  }

  componentDidMount() {
    this.initialGetContentHeigh('init');
  }

  componentDidUpdate() {
    const refChanged = this.oldRef.current.clientHeight !== this.content.current.clientHeight;
    if (refChanged) {
      this.initialGetContentHeigh('update');
    }
  }

  initialGetContentHeigh = (key) => {
    const initHeight = this.content.current.clientHeight;
    this.oldRef.current.clientHeight = initHeight;
    let childHeight = '';
    if (key === 'init') {
      childHeight = `100vh`;
    } else {
      childHeight = `${initHeight}px`;
    }
    this.setState({ childHeight });
  };

  render() {
    const { children, isCollapsed } = this.props;
    const { childHeight } = this.state;

    return (
      <div
        className={styles.collapsed}
        style={{
          maxHeight: isCollapsed ? childHeight : 0,
        }}
      >
        <div ref={this.content}>{children}</div>
      </div>
    );
  }
}

export default CollapseNode;
