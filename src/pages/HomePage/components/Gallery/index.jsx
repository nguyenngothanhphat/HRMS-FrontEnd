import React, { useEffect } from 'react';
import { connect } from 'umi';
import Card from './components/Card';
import styles from './index.less';
import { TAB_IDS } from '@/utils/homePage';

const Gallery = (props) => {
  const { dispatch } = props;

  // redux
  const {
    homePage: { images = [] } = {},
    // user: { currentUser: { employee = {} } = {} } = {},
  } = props;

  const fetchData = () => {
    return dispatch({
      type: 'homePage/fetchPostListByTypeEffect',
      payload: {
        postType: TAB_IDS.IMAGES,
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
