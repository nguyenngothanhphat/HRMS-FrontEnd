import React from 'react';
import { connect } from 'umi';
import PrevIcon from '@/assets/timeSheet/prevPagination.svg';
import NextIcon from '@/assets/timeSheet/nextPagination.svg';
import styles from './index.less';

const Pagination = (props) => {
  const {
    tablePagination: {
      page: currentPage = 0,
      // pageCount = 0,
      pageSize = 0,
      rowCount = 0,
    } = {},
    onChangePage = () => {},
  } = props;

  const onPrevPage = () => {
    if (currentPage > 1) {
      onChangePage(currentPage - 1);
    }
  };

  const onNextPage = () => {
    if (currentPage < rowCount / pageSize) {
      onChangePage(currentPage + 1);
    }
  };

  const lastIndex = currentPage * pageSize > rowCount ? rowCount : currentPage * pageSize;
  // MAIN AREA
  return (
    <div className={styles.Pagination}>
      <span>
        Showing{' '}
        <span className={styles.currentPage}>
          {currentPage * pageSize - pageSize + 1}-{lastIndex}
        </span>{' '}
        of {rowCount}
      </span>
      <img src={PrevIcon} alt="" onClick={onPrevPage} />
      <img src={NextIcon} alt="" onClick={onNextPage} />
    </div>
  );
};

export default connect(() => ({}))(Pagination);
