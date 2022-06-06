import React, { PureComponent } from 'react';
import moment from 'moment';
import { Input, Checkbox } from 'antd';
import s from './index.less';

const { TextArea } = Input;

export default class ClosingComment extends PureComponent {
  render() {
    const {
      data: {
        content = '',
        updatedAt = '',
        ownerComment: { generalInfo: { firstName = '' } = {} } = {},
      } = {},
    } = this.props;
    const time = moment(updatedAt).format('DD.MM.YY | h:mm A');
    return (
      <div className={s.root}>
        <div className={s.viewTop}>
          <div className={s.viewTop__title}>Closing comments from 1-on-1</div>
          <div className={s.viewTop__info}>
            Lasted updated by {firstName} | {time}
          </div>
        </div>
        <TextArea className={s.boxComment} value={content} disabled />
        <div className={s.viewRehire}>
          <Checkbox defaultChecked disabled />
          <span className={s.viewRehire__text1}>Can be rehired</span>
          <span className={s.viewRehire__text2}>
            (This will remain private to yourself and the approving manager)
          </span>
        </div>
      </div>
    );
  }
}
