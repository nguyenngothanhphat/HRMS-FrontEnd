import React, { Component } from 'react';
import styles from './index.less';

class CollapseNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childHeight: 0,
    };

    this.content = React.createRef();
  }

  componentDidMount() {
    const childHeightRaw = this.content.current.clientHeight;
    const childHeight = `${childHeightRaw / 16}rem`;

    this.setState({ childHeight });
  }

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
