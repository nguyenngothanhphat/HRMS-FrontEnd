import { Checkbox, Col, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import styles from './index.less';

const WidgetCard = (props) => {
  const {
    item: { id = '', name = '', description = '', image = '' } = {},
    onSelectWidget = () => {},
    checked = false,
  } = props;

  const onChange = (e) => {
    const { target: { checked: checkedTemp } = {} } = e;
    onSelectWidget(id, checkedTemp);
  };

  return (
    <Col span={12} className={styles.WidgetCard}>
      <Row gutter={[16]}>
        <Col span={3}>
          <Checkbox defaultChecked={checked} onChange={onChange} />
        </Col>
        <Col span={21}>
          <div className={styles.cardContainer}>
            <div className={styles.preview}><img src={image} alt='Preview' style={{"width":"110%"}} /></div>
            <div className={styles.info}>
              <span className={styles.info__title}>{name}</span>
              <span className={styles.info__description}>{description}</span>
            </div>
          </div>
        </Col>
      </Row>
    </Col>
  );
};

export default connect(() => ({}))(WidgetCard);
