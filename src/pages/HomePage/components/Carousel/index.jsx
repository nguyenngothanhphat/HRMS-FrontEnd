import React, { useEffect, useState } from 'react';
import { Carousel as CarouselAntd, Spin } from 'antd';
import { connect } from 'umi';
import Banner1 from '@/assets/homePage/banner1.png';
import NextIcon from '@/assets/homePage/next.svg';
import PrevIcon from '@/assets/homePage/prev.svg';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';
import { TAB_IDS } from '@/utils/homePage';
import { getCurrentLocation } from '@/utils/authority';

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

  const [bannerState, setBannerState] = useState([]);

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
    const bannersTemp = banners.sort(compare);

    if (bannersTemp.length > 0) {
      bannersTemp.forEach((x) => {
        bannerStateTemp = [...bannerStateTemp, ...x.attachments];
      });
    }

    setBannerState(bannerStateTemp);
  }, [JSON.stringify(banners)]);

  // RENDER UI
  if (!loadingFetchBanners && !previewing && bannerState.length === 0) {
    return (
      <div className={styles.Carousel}>
        <EmptyComponent description="No banners" />
      </div>
    );
  }
  return (
    <Spin spinning={loadingFetchBanners}>
      <div
        className={styles.Carousel}
        style={
          previewing
            ? { border: 'none', borderRadius: 0 }
            : { minHeight: loadingFetchBanners ? 200 : 'unset' }
        }
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
    </Spin>
  );
};

export default connect(({ homePage, loading }) => ({
  homePage,
  loadingFetchBanners: loading.effects['homePage/fetchBannersEffect'],
}))(Carousel);
