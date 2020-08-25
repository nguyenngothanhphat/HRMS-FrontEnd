import React from 'react';
import { Row, Col, Button, Icon, Tooltip, Card } from 'antd';
import { Link } from 'umi';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PriceInput from '@/components/PriceInßput';
import styles from './Widget.less';

const ExpenseWidget = ({ title, type, addLink = '#', column, loading }) => {
  return (
    <Card className={styles.box} loading={loading}>
      <Row type="flex" align="middle" justify="space-between">
        <Col className={styles.title}>{title}</Col>
        <Col>
          <Link to={addLink}>
            <Button type="primary">
              <Icon type="plus" />
              <FormattedMessage id="dashboard.button.add-new">
                {txt => <span>{txt.toUpperCase()}</span>}
              </FormattedMessage>
            </Button>
          </Link>
        </Col>
      </Row>
      <Row gutter={12} className={styles.content} justify="space-between">
        {Array.isArray(column) &&
          column.map(({ title: itemTitle, text, type: typeItem, count, link }) => {
            const objectText = {
              amount: ({ amount, currency }) =>
                amount > 500000 ? (
                  <Tooltip
                    placement="bottom"
                    title={<PriceInput value={{ currency, number: amount }} />}
                  >
                    <div className={styles.text}>
                      <PriceInput value={{ currency, number: 500000 }} postfix="+" />
                    </div>
                  </Tooltip>
                ) : (
                  <div className={styles.text}>
                    <PriceInput value={{ currency, number: amount }} />
                  </div>
                ),
              false: t => <div className={styles.text}>{t}</div>,
            };
            const fc = objectText[typeItem] || objectText[!!typeItem];

            return (
              <Col sm={24 / column.length} key={itemTitle}>
                <Link to={link}>
                  <h3 className={styles.subTitle}>
                    {itemTitle} {count > 0 ? `(${count})` : ''}
                  </h3>
                  {fc(text)}
                </Link>
              </Col>
            );
          })}
      </Row>
      <div className={styles.footer}>
        <Link to={`/${type}`} className={styles.manage}>
          {formatMessage({ id: `dashboard.manage.${type}` })}
        </Link>
      </div>
    </Card>
  );
};

export default ExpenseWidget;
