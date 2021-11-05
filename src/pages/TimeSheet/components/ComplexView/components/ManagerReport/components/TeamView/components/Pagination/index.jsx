import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import PrevIcon from '@/assets/timeSheet/prevPagination.svg';
import NextIcon from '@/assets/timeSheet/nextPagination.svg';
import styles from './index.less';

const rowCount = 5;

const Pagination = (props) => {
  const { list = [1, 2, 3, 4, 5, 6, 7, 8] } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const onPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onNextPage = () => {
    if (currentPage < list.length / rowCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  const lastIndex = currentPage * rowCount > list.length ? list.length : currentPage * rowCount;
  // MAIN AREA
  return (
    <div className={styles.Pagination}>
      <span>
        Showing{' '}
        <span className={styles.currentPage}>
          {currentPage * rowCount - rowCount + 1}-{lastIndex}
        </span>{' '}
        of {list.length}
      </span>
      <img src={PrevIcon} alt="" onClick={onPrevPage} />
      <img src={NextIcon} alt="" onClick={onNextPage} />
    </div>
  );
};

export default connect(() => ({}))(Pagination);
