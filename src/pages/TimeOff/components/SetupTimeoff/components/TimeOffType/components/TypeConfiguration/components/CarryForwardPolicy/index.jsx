import { Button, Card, Col, Form, Row } from 'antd';
import React from 'react';
import { connect } from 'umi';
import { FORM_ITEM_NAME } from '@/utils/timeOff';
import CarryForwardItem from './components/CarryForwardItem';
import styles from './index.less';

const CarryForwardPolicy = (props) => {
  const { configs = {}, form, workHourPerDay = 0, renderErrorMessage = () => {} } = props;

  return (
    <Card title="Carry Forward Policy" className={styles.CarryForwardPolicy}>
      <div className={styles.container}>
        <Row gutter={[24, 24]}>
          <Form.List name={FORM_ITEM_NAME.CARRY_FORWARD_POLICY}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }, index) => (
                  <Col span={24} key={key}>
                    <CarryForwardItem
                      name={name}
                      remove={remove}
                      index={index}
                      configs={configs}
                      form={form}
                      workHourPerDay={workHourPerDay}
                      renderErrorMessage={renderErrorMessage}
                    />
                  </Col>
                ))}
                <Col span={24}>
                  <Form.Item>
                    <Button onClick={add}>Add new carry forward</Button>
                  </Form.Item>
                </Col>
              </>
            )}
          </Form.List>
        </Row>
      </div>
    </Card>
  );
};
export default connect(() => ({}))(CarryForwardPolicy);
