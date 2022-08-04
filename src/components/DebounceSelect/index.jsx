import { Empty, Select, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import DefaultAvatar from '@/assets/avtDefault.jpg';

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

  const { optionType = '' } = props;

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={
        <Spin size="small" spinning={fetching}>
          <Empty description="No data, type to search" />
        </Spin>
      }
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {optionType === 1
        ? options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            <div
              style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
            >
              <img
                src={option.avatar}
                alt=""
                onError={(e) => {
                    e.target.src = DefaultAvatar;
                  }}
                style={{
                    minWidth: 24,
                    width: 24,
                    height: 24,
                    marginRight: 8,
                    borderRadius: '50%',
                  }}
              />
              <span>
                <span
                  style={{
                      fontWeight: 500,
                    }}
                >
                  {option.label}
                </span>{' '}
                ({option.employeeId}) ({option.userId})
              </span>
            </div>
          </Select.Option>
          ))
        : options.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
          ))}
    </Select>
  );
};

export default DebounceSelect;
