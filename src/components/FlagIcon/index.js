import React, { PureComponent } from 'react';
import { getEmojiDataFromNative, Emoji } from 'emoji-mart';
import data from 'emoji-mart/data/facebook.json';
import classNames from 'classnames';
import { connect } from 'dva';
import 'emoji-mart/css/emoji-mart.css';
import styles from './index.less';

@connect()
class FlagIcon extends PureComponent {
  constructor(props) {
    super(props);
    const { native = '' } = props;
    const emoji = getEmojiDataFromNative(native, 'facebook', data);

    this.state = {
      native,
      emoji,
    };
  }

  render() {
    const { native, emoji } = this.state;
    const { children = native, size = 20 } = this.props;
    return emoji ? (
      <Emoji emoji={emoji} set="facebook" size={size} sheetSize={size} />
    ) : (
      <span className={classNames(styles.flag)}>{children}</span>
    );
  }
}

export default FlagIcon;
