import { Carousel } from 'antd';
import React from 'react';
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

  return (
    <div className={styles.Card}>
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
        {!previewing ? data.map((x) => renderCard(x)) : contentPreview.map((x) => renderCard(x))}
      </Carousel>
    </div>
  );
};

export default Card;
