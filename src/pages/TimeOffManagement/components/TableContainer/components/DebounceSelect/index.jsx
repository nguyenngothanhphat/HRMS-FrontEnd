import React from 'react';

const { Empty, Select, Spin } = require('antd');
const { debounce } = require('lodash');
const { useState, useRef, useMemo } = require('react');

const DebounceSelect = ({ fetchOptions, debounceTimeout = 800, ...props }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);
      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      // labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      dropdownRender={(menu) => (
        <>
          {options.length > 0 && (
            <p
              style={{
                fontSize: 12,
                fontStyle: 'italic',
                color: '#8c8c8c',
                marginBlock: 6,
                paddingLeft: 12,
              }}
            >
              Type to search
            </p>
          )}
          {menu}
        </>
      )}
      notFoundContent={
        <Spin size="small" spinning={fetching}>
          <Empty description={<span style={{ fontSize: 12 }}>No data, type to search</span>} />
        </Spin>
      }
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {`${option?.employeeId} - ${option?.label}`}
        </Select.Option>
      ))}
    </Select>
  );
};

export default DebounceSelect;
