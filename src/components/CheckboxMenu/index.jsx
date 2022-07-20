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
    multiple = true,
  } = props;

  const [indeterminate, setIndeterminate] = React.useState(false);
  const [checkAll, setCheckAll] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (defaultChecks.length > 0) {
      setSelectedItems([...defaultChecks]);
    }
  }, [JSON.stringify(defaultChecks)]);

  useEffect(() => {
    if (selectedItems.length && selectedItems.length === options.length) {
      setCheckAll(true);
      setIndeterminate(false);
    } else {
      setCheckAll(false);
      if (selectedItems.length && selectedItems.length < options.length) setIndeterminate(true);
      else setIndeterminate(false);
    }
  }, [selectedItems]);

  const onCheckAllChange = (e) => {
    const selectedItemsTemp = e.target.checked ? options.map((x) => x._id) : [];
    setSelectedItems(selectedItemsTemp);
    return onChangeProp([...selectedItemsTemp]);
  };

  const onChange = (selection) => {
    setSelectedItems([...selection]);
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
            disabled={disabled || !multiple}
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
  if (options.length < 2) return children;
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
