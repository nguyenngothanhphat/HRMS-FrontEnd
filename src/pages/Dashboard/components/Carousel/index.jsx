import React, { PureComponent } from 'react';
import { ReactComponent as IconNext } from '@/assets/next.svg';
import { ReactComponent as IconBack } from '@/assets/back.svg';
import { Carousel } from 'antd';
import { formatMessage } from 'umi';
import s from './index.less';

export default class Panner extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <Carousel arrows prevArrow={<IconBack />} nextArrow={<IconNext />}>
          <div className={`${s.content} ${s.bg1}`}>
            <div className={s.content1}>
              <div className={s.content1__text1}>
                {formatMessage({ id: 'pages.dashboard.carousel.welcome' })} Jason!
              </div>
              <div className={s.content1__text2}>
                He has joined our studio as an Illustrator. Here’s a message from him.
              </div>
              <div className={s.content1__text3}>View Message</div>
            </div>
          </div>
          <div className={`${s.content} ${s.bg1}`}>
            <div className={s.content1}>
              <div className={s.content1__text1}>
                {formatMessage({ id: 'pages.dashboard.carousel.welcome' })} Jason!
              </div>
              <div className={s.content1__text2}>
                He has joined our studio as an Illustrator. Here’s a message from him.
              </div>
              <div className={s.content1__text3}>View Message</div>
            </div>
          </div>
          <div className={`${s.content} ${s.bg1}`}>
            <div className={s.content1}>
              <div className={s.content1__text1}>
                {formatMessage({ id: 'pages.dashboard.carousel.welcome' })} Jason!
              </div>
              <div className={s.content1__text2}>
                He has joined our studio as an Illustrator. Here’s a message from him.
              </div>
              <div className={s.content1__text3}>View Message</div>
            </div>
          </div>
        </Carousel>
      </div>
    );
  }
}
