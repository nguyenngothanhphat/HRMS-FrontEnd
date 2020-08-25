import React, { Component, Fragment, Suspense } from 'react';
import 'emoji-mart/css/emoji-mart.css';
import dataEmoji from 'emoji-mart/data/facebook.json';
import { NimblePicker as Picker } from 'emoji-mart';
import { Input, Popover } from 'antd';
import styles from './index.less';
import PageLoading from '../PageLoading';

class EmojiPicker extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return { native: nextProps.value };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { value } = props;

    this.state = {
      visible: false,
      native: value,
    };
  }

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  handleSelect = ({ native }) => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(native);
    this.setState({ visible: false });
  };

  render() {
    const { placeholder } = this.props;
    const { visible, native } = this.state;

    return (
      <Popover
        className={styles.input}
        content={
          <Fragment>
            <Suspense fallback={<PageLoading />}>
              <Picker
                data={dataEmoji}
                set="facebook"
                include={['flags']}
                title="Choose one icon"
                onSelect={this.handleSelect}
              />
            </Suspense>
          </Fragment>
        }
        trigger="hover"
        visible={visible}
        placement="bottom"
        onVisibleChange={this.handleVisibleChange}
      >
        <Input placeholder={placeholder} value={native} />
      </Popover>
    );
  }
}

export default EmojiPicker;
