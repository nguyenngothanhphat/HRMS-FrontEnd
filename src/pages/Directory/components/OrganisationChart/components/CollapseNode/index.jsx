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
    this.initialGetContentHeigh();
  }

  componentDidUpdate() {
    const refChanged = this.oldRef.current.clientHeight !== this.content.current.clientHeight;
    if (refChanged) {
      this.initialGetContentHeigh();
    }
  }

  initialGetContentHeigh = () => {
    const initHeight = this.content.current.clientHeight;
    this.oldRef.current.clientHeight = initHeight;
    const childHeightRaw = this.content.current.clientHeight;
    const childHeight = `${childHeightRaw}px`;
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
