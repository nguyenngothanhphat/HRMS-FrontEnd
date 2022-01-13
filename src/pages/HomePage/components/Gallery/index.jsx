import { Carousel } from 'antd';
import React from 'react';
import NextIcon from '@/assets/homePage/next.svg';
import PrevIcon from '@/assets/homePage/prev.svg';
import SampleImage from '@/assets/homePage/samplePhoto.png';
import styles from './index.less';

const data = [
  {
    id: 1,
    content: 'No events',
    image: SampleImage,
  },
];

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={NextIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={PrevIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const Gallery = () => {
  const renderCard = (card) => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img src={card.image} alt="" />
        </div>
        <div className={styles.content}>
          <p className={styles.title}>{card.title}</p>
          <p className={styles.caption}>{card.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.Gallery}>
      <p className={styles.titleText}>Gallery</p>
      <Carousel
        infinite
        arrows
        dots
        autoplay
        autoplaySpeed={10000}
        nextArrow={<NextArrow />}
        prevArrow={<PrevArrow />}
      >
        {data.map((x) => renderCard(x))}
      </Carousel>
    </div>
  );
};

export default Gallery;
