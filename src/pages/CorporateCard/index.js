import React, { useEffect } from 'react';
import { Row } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import windowSize from 'react-window-size';
import ListTable from './ListTable';
import styles from './index.less';

const CorporateCard = props => {
  const {
    dispatch,
    creditCard: { listCard: creditCardList = [] },
    loading,
    user: { currentUser: { location: { id: locationId = '' } = {} } = {} } = {},
  } = props;

  useEffect(() => {
    const payload = { location: locationId };
    dispatch({ type: 'creditCard/fetchByAssignForEmployee', ...payload });
  }, []);

  return (
    <div className={styles.listRpWrapper}>
      <Row type="flex" justify="space-between">
        <div className={styles.title}>
          <span>{formatMessage({ id: 'corporatecard.listTitle' })}</span>
        </div>
      </Row>

      <ListTable list={creditCardList} loading={loading} {...props} />
    </div>
  );
};

export default connect(({ loading, creditCard, user, currency }) => ({
  user,
  creditCard,
  loading: loading.models.creditCard,
  currency,
}))(windowSize(CorporateCard));
