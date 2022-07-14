import { Carousel, Spin } from 'antd';
import React from 'react';
import { connect } from 'umi';
import NextIcon from '@/assets/homePage/next.svg';
import PrevIcon from '@/assets/homePage/prev.svg';
import SampleImage from '@/assets/homePage/samplePhoto.png';
import styles from './index.less';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={NextIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={PrevIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const Card = (props) => {
  const {
    data = [],
    // FOR PREVIEWING IN SETTINGS PAGE
    previewing = false,
    contentPreview = [],
    loadingRefresh = false,
  } = props;

  const renderCard = (card) => {
    const { attachments = [], description = '', title = '' } = card;
    const [firstImage] = attachments;
    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img src={firstImage?.url || SampleImage} alt="" />
        </div>
        <div className={styles.content}>
          <p className={styles.title}>{title}</p>
          <p className={styles.caption}>{description}</p>
        </div>
      </div>
    );
  };

  const renderData = () => {
    if (!previewing) {
      if (data.length === 0) {
        const emptyCard = {
          attachments: [],
          description: 'No events',
          title: '',
        };
        return renderCard(emptyCard);
      }
      return data.map((x) => renderCard(x));
    }
    return contentPreview.map((x) => renderCard(x));
  };

  return (
    <div className={styles.Card}>
      <Spin spinning={loadingRefresh}>
        <Carousel
          infinite
          arrows
          dots
          autoplay
          autoplaySpeed={10000}
          lazyLoad="ondemand"
          nextArrow={<NextArrow />}
          prevArrow={<PrevArrow />}
        >
          {renderData()}
        </Carousel>
      </Spin>
    </div>
  );
};

export default connect(({ loading, user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
  loadingRefresh: loading.effects['homePage/fetchImagesEffect'],
}))(Card);
