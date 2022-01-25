import React from 'react';
import { Carousel as CarouselAntd } from 'antd';
import Banner1 from '@/assets/homePage/banner1.png';
import Nuova1 from '@/assets/homePage/nuova1.png';
import Nuova2 from '@/assets/homePage/nuova2.png';
import Nuova3 from '@/assets/homePage/nuova3.png';
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

const Carousel = (props) => {
  /* FOR PREVIEWING IN SETTINGS PAGE  */
  const { previewing = false, contentPreview = [] } = props;

  const images = [
    {
      id: 1,
      image: Nuova1,
    },
    {
      id: 2,
      image: Nuova2,
    },
    {
      id: 3,
      image: Nuova3,
    },
    {
      id: 4,
      image: Banner1,
    },
  ];

  return (
    <div className={styles.Carousel}>
      <CarouselAntd
        infinite
        arrows
        dots
        autoplay
        autoplaySpeed={10000}
        nextArrow={<NextArrow />}
        lazyLoad="ondemand"
        prevArrow={<PrevArrow />}
      >
        {!previewing &&
          images.map((x) => (
            <div className={styles.image}>
              <img src={x.image} alt="" />
            </div>
          ))}

        {/* FOR PREVIEWING IN SETTINGS PAGE  */}
        {previewing &&
          contentPreview.length > 0 &&
          contentPreview.map((x) => (
            <div className={styles.image}>
              <img src={x} alt="" />
            </div>
          ))}

        {previewing && contentPreview.length === 0 && (
          <div className={styles.image}>
            <img src={Banner1} alt="" />
          </div>
        )}
      </CarouselAntd>
    </div>
  );
};

export default Carousel;
