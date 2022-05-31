import React, { useEffect } from 'react';
import { connect } from 'umi';
import Card from './components/Card';
import styles from './index.less';
import { TAB_IDS } from '@/utils/homePage';
import { getCurrentLocation } from '@/utils/authority';

const Gallery = (props) => {
  const { dispatch } = props;

  // redux
  const {
    homePage: { images = [] } = {},
    // user: { currentUser: { employee = {} } = {} } = {},
  } = props;

  const fetchData = () => {
    return dispatch({
      type: 'homePage/fetchImagesEffect',
      payload: {
        postType: TAB_IDS.IMAGES,
        location: [getCurrentLocation()],
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.Gallery}>
      <p className={styles.titleText}>Gallery</p>
      <Card data={images} />
    </div>
  );
};

export default connect(({ homePage }) => ({
  homePage,
}))(Gallery);
