import { Button, Col } from 'antd';
import React from 'react';
import ShowMoreIcon from '@/assets/homePage/downArrow.svg';
import RightIcon from '@/assets/ticketManagement/rightArrow.svg';
import NotShowIcon from '@/assets/ticketManagement/up.svg';
import styles from './index.less';

export default function TicketUpdatedContent(props) {
  const { message } = props;
  const [view, setView] = React.useState(false);
  const renderViewDetailBtn = () => {
    return (
      <Col span={24}>
        <div className={styles.showDetail}>
          <Button
            onClick={() => {
              setView(!view);
            }}
          >
            View Detail
            <img src={view ? NotShowIcon : ShowMoreIcon} alt="" />
          </Button>
        </div>
      </Col>
    );
  };
  return (
    <div className={styles.TicketUpdatedContent}>
      <hr style={{ border: '1px solid #EAECF0' }} />
      {view &&
        message.map((x) => (
          <div className={styles.chatMessage}>
            {x.name === 'attachments' ? (
              <>
                <div className={styles.chatMessage__title}>{x.name}:</div>
                {x.oldValue[0]?.attachmentName ? (
                  <span>
                    {x.oldValue[0]?.attachmentName} <img src={RightIcon} alt="" />{' '}
                  </span>
                ) : (
                  <span>Add </span>
                )}
                {x.newValue[0]?.attachmentName ? (
                  <span className={styles.chatMessage__changed}>
                    {x.newValue[0]?.attachmentName}
                  </span>
                ) : (
                  <span className={styles.chatMessage__changed}>deleted</span>
                )}
              </>
            ) : (
              <>
                <div className={styles.chatMessage__title}>{x.name}:</div>
                {`${x.oldValue || ''} `}
                <img src={RightIcon} alt="" />{' '}
                <span className={styles.chatMessage__changed}>{x.newValue}</span>
              </>
            )}
          </div>
        ))}
      {renderViewDetailBtn()}
    </div>
  );
}
