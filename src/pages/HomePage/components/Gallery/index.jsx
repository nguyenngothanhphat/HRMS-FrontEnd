import React from 'react';
import SampleImage from '@/assets/homePage/samplePhoto.png';
import Card from './components/Card';
import styles from './index.less';

const data = [
  {
    id: 1,
    content: 'No events',
    image: SampleImage,
  },
];

const Gallery = () => {
  return (
    <div className={styles.Gallery}>
      <p className={styles.titleText}>Gallery</p>
      <Card data={data} />
    </div>
  );
};

export default Gallery;
