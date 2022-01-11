import React from 'react';
import { Carousel } from 'antd';
import styles from './index.less';
import BirthdayImage from '@/assets/homePage/birthdayFakeImage.png';
import LikeIcon from '@/assets/homePage/like.svg';
import CommentIcon from '@/assets/homePage/comment.svg';

const data = [
  {
    id: 1,
    content: 'Harivishwak SR is celebrating his birthday today. (28-12-2021)',
    image: BirthdayImage,
    likes: 10,
    comments: 23,
  },
  {
    id: 2,
    content:
      'Lewis is celebrating his birthday today, Lewis is celebrating his birthday today, Lewis is celebrating his birthday today. (28-12-2021)',
    image: BirthdayImage,
    likes: 1,
    comments: 2,
  },
];

const Celebrating = () => {
  const renderCard = (card) => {
    return (
      <div className={styles.cardContainer}>
        <div className={styles.image}>
          <img src={card.image} alt="" />
        </div>
        <div className={styles.content}>
          <p className={styles.caption}>{card.content}</p>

          <div className={styles.actions}>
            <div className={styles.likes}>
              <img src={LikeIcon} alt="" />
              <span>{card.likes || 0} Likes</span>
            </div>
            <div className={styles.comments}>
              <img src={CommentIcon} alt="" />
              <span>{card.comments || 0} Comments</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.Celebrating}>
      <p className={styles.titleText}>Lets celebrate</p>
      <Carousel infinite arrows dots>
        {data.map((x) => renderCard(x))}
      </Carousel>
    </div>
  );
};

export default Celebrating;
