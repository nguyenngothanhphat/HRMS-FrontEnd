import { Empty, Select, Spin } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DefaultAvatar from '@/assets/avtDefault.jpg';

const DebounceSelect = ({
  fetchOptions,
  debounceTimeout = 800,
  labelInValue = false,
  optionType = '',
  defaultOptions, // you can pass an array or an object to this prop, needs to have { value, label } keys
  ...props
}) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const didMount = useRef(true);
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

  // for select has default value, no need to call all employee list
  useEffect(() => {
    if (!isEmpty(defaultOptions) && options.length === 0 && didMount.current) {
      let newOptions = [];
      if (Array.isArray(defaultOptions)) {
        newOptions = defaultOptions;
      } else if (typeof defaultOptions === 'object') {
        newOptions.push({
          value: defaultOptions?.value,
          label: defaultOptions?.label,
        });
      }
      setOptions(newOptions);
      didMount.current = false;
    }
  }, [JSON.stringify(defaultOptions)]);

  return (
    <Select
      labelInValue={labelInValue}
      filterOption={false}
      onSearch={debounceFetcher}
      showSearch
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
      {defaultOptions?.length &&
        options.length === 0 &&
        defaultOptions.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
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
