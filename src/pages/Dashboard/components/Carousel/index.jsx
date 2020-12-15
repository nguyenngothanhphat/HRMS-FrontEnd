import React, { PureComponent } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Carousel } from 'antd';
import s from './index.less';

export default class Panner extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <Carousel effect="fade" arrows prevArrow={<LeftOutlined />} nextArrow={<RightOutlined />}>
          <div className={`${s.content} ${s.bg1}`}>
            <div className={s.content1}>
              <div className={s.content1__text1}>Welcome Jason!</div>
              <div className={s.content1__text2}>
                He has joined our studio as an Illustrator. Here’s a message from him.
              </div>
              <div className={s.content1__text3}>View Message</div>
            </div>
          </div>
          <div className={`${s.content} ${s.bg1}`} />
          <div className={`${s.content} ${s.bg1}`} />
        </Carousel>
      </div>
    );
  }
}
