import { Col, Empty, Row, Spin } from 'antd';
import React from 'react';
import CustomSearchBox from '@/components/CustomSearchBox';
import styles from './index.less';

const DropdownSearch = (props) => {
  const {
    onChangeSearch = () => {},
    employeeFilterList = [],
    handleSelectChange = () => {},
    loading = false,
  } = props;

  return (
    <div className={styles.DropdownSearch}>
      <div className={styles.searchContainer}>
        <CustomSearchBox onSearch={onChangeSearch} borderRadius={6} placeholder="Search by Name" />
      </div>
      <Spin spinning={loading}>
        <div className={styles.listEmployee}>
          {employeeFilterList.length > 0 ? (
            <Row>
              {employeeFilterList.map((x) => (
                <Col span={24}>
                  <div className={styles.employee} onClick={handleSelectChange}>
                    <span>{x.generalInfo?.legalName}</span>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <div className={styles.emptyContainer}>
              <Empty />
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
};
export default DropdownSearch;
