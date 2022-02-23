import React, { useEffect, useState } from 'react';
import { Carousel as CarouselAntd } from 'antd';
import { connect } from 'umi';
import Banner1 from '@/assets/homePage/banner1.png';
import NextIcon from '@/assets/homePage/next.svg';
import PrevIcon from '@/assets/homePage/prev.svg';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';
import { TAB_IDS } from '@/utils/homePage';

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={NextIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return <img src={PrevIcon} className={className} style={style} alt="" onClick={onClick} />;
};

const Carousel = (props) => {
  const { dispatch } = props;

  /* FOR PREVIEWING IN SETTINGS PAGE  */
  const { previewing = false, contentPreview = [] } = props;

  // redux
  const {
    homePage: { banners = [] } = {},
    // user: { currentUser: { employee = {} } = {} } = {},
    loadingFetchBanners = false,
  } = props;

  const [bannerState, setBannerState] = useState({
    attachments: [],
  });

  const fetchData = () => {
    return dispatch({
      type: 'homePage/fetchBannersEffect',
      payload: {
        postType: TAB_IDS.BANNER,
      },
    });
  };

  const compare = (a, b) => {
    if (a.position < b.position) return -1;
    if (a.position > b.position) return 1;
    return 0;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let bannerStateTemp = [];
    banners.forEach((x) => {
      bannerStateTemp = [...bannerStateTemp, ...x.attachments];
    });
    bannerStateTemp = bannerStateTemp.sort(compare);
    setBannerState(bannerStateTemp);
  }, [JSON.stringify(banners)]);

  // RENDER UI
  if (loadingFetchBanners) return '';
  if (!previewing && bannerState?.attachments) {
    if (bannerState.attachments.length === 0) {
      return (
        <div className={styles.Carousel}>
          <EmptyComponent description="No banner available" />
        </div>
      );
    }
  }
  return (
    <div
      className={styles.Carousel}
      style={previewing ? { border: 'none', borderRadius: 0 } : null}
    >
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
          bannerState.map((x) => (
            <div className={styles.image}>
              <img src={x.url} alt="" />
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

export default connect(({ homePage, loading }) => ({
  homePage,
  loadingFetchBanners: loading.effects['homePage/fetchBannersEffect'],
}))(Carousel);
