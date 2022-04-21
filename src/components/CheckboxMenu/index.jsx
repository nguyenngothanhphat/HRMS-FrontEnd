import { Checkbox, Col, Popover, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './index.less';

const CheckboxMenu = (props) => {
  const {
    children,
    onChange: onChangeProp = () => {},
    options = [],
    default: defaultChecks = [],
    disabled = false,
  } = props;
  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems([...defaultChecks]);
  }, [JSON.stringify(defaultChecks)]);

  const onCheckAllChange = (e) => {
    const selectedItemsTemp = e.target.checked ? options.map((x) => x._id) : [];
    setSelectedItems(selectedItemsTemp);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    return onChangeProp([...selectedItemsTemp]);
  };

  const onChange = (selection) => {
    setSelectedItems([...selection]);
    setIndeterminate(!!selection.length && selection.length < options.length);
    setCheckAll(selection.length === options.length);
    return onChangeProp([...selection]);
  };

  const checkboxRender = () => {
    const groups = options
      .map((e, i) => {
        return i % 10 === 0 ? options.slice(i, i + 10) : null;
      })
      .filter((e) => {
        return e;
      });

    return (
      <Row className={styles.content}>
        <Col span={24}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
            style={{ display: 'flex', margin: '8px 0' }}
            disabled={disabled}
          >
            Select All
          </Checkbox>
        </Col>
        <Checkbox.Group onChange={onChange} value={selectedItems} disabled={disabled}>
          {groups.map((group, i) => {
            return (
              <Col key={`checkbox-group-${i + 1}`} span={24}>
                {group.map((x) => {
                  return (
                    <Checkbox
                      key={x._id}
                      value={x._id}
                      style={{ display: 'flex', margin: '8px 0' }}
                    >
                      {x.name}
                    </Checkbox>
                  );
                })}
              </Col>
            );
          })}
        </Checkbox.Group>
      </Row>
    );
  };

  const CheckboxRender = checkboxRender;
  return (
    <Popover
      content={<CheckboxRender />}
      trigger="click"
      placement="bottomRight"
      overlayClassName={styles.CheckboxMenu}
    >
      {children}
    </Popover>
  );
};

export default CheckboxMenu;
