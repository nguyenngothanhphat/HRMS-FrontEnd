import React from 'react';
import { Carousel as CarouselAntd } from 'antd';
import Banner1 from '@/assets/homePage/banner1.svg';
import NextIcon from '@/assets/homePage/next.svg';
import PrevIcon from '@/assets/homePage/prev.svg';
import styles from './index.less';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={NextIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={PrevIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const Carousel = () => {
  const images = [
    {
      id: 1,
      image: Banner1,
    },
    {
      id: 2,
      image: Banner1,
    },
    {
      id: 3,
      image: Banner1,
    },
  ];

  return (
    <div className={styles.Carousel}>
      <CarouselAntd infinite arrows dots nextArrow={<NextArrow />} prevArrow={<PrevArrow />}>
        {images.map((x) => (
          <div className={styles.image}>
            <img src={x.image} alt="" />
          </div>
        ))}
      </CarouselAntd>
    </div>
  );
};

export default Carousel;
