import { Col, Row } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/timeSheet/add.svg';
import ActivityCard from './components/ActivityCard';
import AddCard from './components/AddCard';
import styles from './index.less';

const dateFormat = 'ddd, MMM Do';

const ActivityList = (props) => {
  const { item = {}, activityIndex } = props;
  const [cardList, setCardList] = useState([]);

  // reset add card when switching time
  useEffect(() => {
    setCardList([]);
  }, [JSON.stringify(item)]);

  const onAddNewCard = () => {
    setCardList([...cardList, {}]);
  };

  const onRemoveCard = (index) => {
    const tempList = JSON.parse(JSON.stringify(cardList));
    tempList.splice(index, 1);
    setCardList(tempList);
  };

  const onEditValue = (values, cardIndex) => {
    const tempCardList = JSON.parse(JSON.stringify(cardList));
    tempCardList[cardIndex] = values;
    setCardList(tempCardList);
  };

  const _renderAddButton = () => {
    return (
      <div className={styles.addButton} onClick={onAddNewCard}>
        <img src={AddIcon} alt="" />
        <span>Add Activity</span>
      </div>
    );
  };

  // MAIN AREA
  return (
    <Row className={styles.ActivityList}>
      <Col span={3} className={`${styles.ActivityList__firstColumn} ${styles.alignCenter}`}>
        <span
          style={
            activityIndex === 0
              ? { display: 'block', marginTop: '10px' }
              : { display: 'block', marginTop: '-18px' }
          }
        >
          {moment(item.date).locale('en').format(dateFormat)}
        </span>
      </Col>
      <Col span={21} className={styles.ActivityList__remainColumn}>
        {item.activities.map((activity) => {
          return <ActivityCard card={activity} />;
        })}
        {cardList.map((card, index) => (
          <AddCard
            card={card}
            onEditValue={onEditValue}
            onRemoveCard={onRemoveCard}
            cardIndex={index}
            cardDay={item.date}
          />
        ))}
        {_renderAddButton()}
      </Col>
    </Row>
  );
};

export default connect(({ timeSheet: { myTimesheet = [] } = {} }) => ({ myTimesheet }))(
  ActivityList,
);
