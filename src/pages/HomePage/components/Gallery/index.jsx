import React from 'react';
import { Carousel } from 'antd';
import styles from './index.less';
import SampleImage from '@/assets/homePage/samplePhoto.png';

const data = [
  {
    id: 1,
    title: 'Annual Event 2021',
    content: `Here's a glimpse of the fun and festivities
    at our Annual Event this year!`,
    image: SampleImage,
  },
  {
    id: 2,
    title: 'Annual Event 2021',
    content: `Here's a glimpse of the fun and festivities
    at our Annual Event this year!`,
    image: SampleImage,
  },
];

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
      <Carousel infinite arrows dots>
        {data.map((x) => renderCard(x))}
      </Carousel>
    </div>
  );
};

export default Gallery;
