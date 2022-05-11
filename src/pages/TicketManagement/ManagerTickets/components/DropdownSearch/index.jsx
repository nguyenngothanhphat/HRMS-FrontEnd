import { SearchOutlined } from '@ant-design/icons';
import { Empty, Input, Menu } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';

const DropdownSearch = (props) => {
  const {
    onChangeSearch = () => {},
    employeeFilterList = [],
    handleSelectChange = () => {},
    styles,
  } = props;
  return (
    <Menu>
      <div className={styles.inputSearch}>
        <Input
          placeholder="Search by name"
          onChange={(e) => onChangeSearch(e.target.value)}
          prefix={<SearchOutlined />}
        />
      </div>
      <Menu.Divider />
      <div style={{ overflowY: 'scroll', maxHeight: '200px' }}>
        {!isEmpty(employeeFilterList) ? (
          employeeFilterList.map((val) => {
            return (
              <Menu.Item onClick={() => handleSelectChange(val._id)} key={val._id} value={val._id}>
                {val.generalInfo?.legalName}
              </Menu.Item>
            );
          })
        ) : (
          <Menu.Item>
            <Empty />
          </Menu.Item>
        )}
      </div>
    </Menu>
  );
};
export default DropdownSearch;
