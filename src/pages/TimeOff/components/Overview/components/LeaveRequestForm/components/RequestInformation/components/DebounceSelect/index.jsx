import { Empty, Select, Spin } from 'antd';
import { debounce } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import styles from './index.less';

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
      {options.map((option) => {
        const {
          generalInfoInfo: { avatar = '', workEmail = '' } = {},
          locationInfo: { headQuarterAddress: { country: { _id: countryId } = {} } = {} } = {},
          _id = '',
        } = option;

        return (
          <Select.Option key={_id} value={[_id, countryId]}>
            <>
              <div style={{ display: 'inline', marginRight: '10px' }}>
                <img
                  style={{
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                  }}
                  src={avatar}
                  alt="user"
                  onError={(e) => {
                    e.target.src = DefaultAvatar;
                  }}
                />
              </div>
              <span style={{ fontSize: '13px', color: '#161C29' }} className={styles.ccEmail}>
                {workEmail}
              </span>
            </>
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default DebounceSelect;
