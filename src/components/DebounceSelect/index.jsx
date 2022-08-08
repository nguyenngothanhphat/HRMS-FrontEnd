import { Empty, Select, Spin } from 'antd';
import { debounce, isEmpty } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import DefaultAvatar from '@/assets/avtDefault.jpg';

const DebounceSelect = ({
  fetchOptions,
  debounceTimeout = 800,
  labelInValue = false,
  defaultValue = {},
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

  const { optionType = '' } = props;

  // for select has default value, no need to call all employee list
  if (!isEmpty(defaultValue) && options.length === 0 && didMount.current) {
    options.push({
      label: defaultValue?.label,
      value: defaultValue.value,
    });
    didMount.current = false;
  }

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
