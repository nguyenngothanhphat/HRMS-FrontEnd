import { Checkbox, Col, DatePicker, Form, Row, Select } from 'antd';
import { debounce } from 'lodash';
import moment from 'moment';
import React from 'react';
import { connect } from 'umi';
import { dateFormat, TIMEOFF_NAME_BY_ID } from '@/utils/timeOffManagement';
// import DownloadIcon from '@/assets/timeOffManagement/ic_download.svg';
import styles from './index.less';
import DebounceSelect from '../DebounceSelect';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';

const { Option } = Select;

const Header = (props) => {
  const [form] = Form.useForm();

  const {
    dispatch,
    timeOffManagement: { typeList = [] } = {},
    setPayload = () => {},
    disabled = false,
    toDate = '',
    fromDate = '',
    setFromDate = () => {},
    setToDate = () => {},
    loadingFetchTimeoffTypes = false,
  } = props;

  const [selectedUser, setSelectedUser] = React.useState();

  // DISABLE DATE OF DATE PICKER
  const disabledFromDate = (current) => {
    return current && current >= moment(toDate);
  };

  const disabledToDate = (current) => {
    return current && current <= moment(fromDate);
  };

  const onSaveDebounce = debounce((values) => {
    setPayload(values);
  }, 1000);

  const onValuesChange = (changedValues, allValues) => {
    const from = allValues.from ? moment(allValues.from).format('YYYY-MM-DD') : null;
    const to = allValues.to ? moment(allValues.to).format('YYYY-MM-DD') : null;
    onSaveDebounce({ ...allValues, from, to });
  };

  const onEmployeeSearch = (value) => {
    if (!value) {
      return new Promise((resolve) => {
        resolve([]);
      });
    }

    return dispatch({
      type: 'timeOffManagement/getListEmployeesEffect',
      payload: {
        name: value,
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
        status: ['INACTIVE', 'ACTIVE'],
      },
    }).then((res = {}) => {
      const { data = [] } = res;
      return data.map((user) => ({
        label: user.generalInfo?.legalName,
        value: user._id,
        employeeId: user?.employeeId,
      }));
    });
  };

  return (
    <div className={styles.Header}>
      <div className={styles.container}>
        <Form
          name="uploadForm"
          form={form}
          onValuesChange={onValuesChange}
          initialValues={{
            from: fromDate,
            to: toDate,
          }}
        >
          <Row gutter={[24, 12]}>
            <Col span={6}>
              <span className={styles.itemLabel}>User ID - Name</span>
              <Form.Item name="employee">
                <DebounceSelect
                  placeholder="Select an user"
                  fetchOptions={onEmployeeSearch}
                  showSearch
                  value={selectedUser}
                  disabled={disabled}
                  onChange={(value) => {
                    setSelectedUser(value);
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <span className={styles.itemLabel}>Duration</span>
              <div>
                <Row gutter={[24, 24]}>
                  <Col xs={12}>
                    <Form.Item name="from">
                      <DatePicker
                        placeholder="From Date"
                        format={dateFormat}
                        disabledDate={disabledFromDate}
                        disabled={disabled}
                        onChange={(val) => setFromDate(val)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <span />
                    <Form.Item name="to">
                      <DatePicker
                        placeholder="To Date"
                        format={dateFormat}
                        disabledDate={disabledToDate}
                        disabled={disabled}
                        onChange={(val) => setToDate(val)}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={6}>
              <span className={styles.itemLabel}>Leave Type</span>
              <div>
                <Row gutter={[24, 24]}>
                  <Col xs={24}>
                    <span />
                    <Form.Item name="types">
                      <Select
                        placeholder="Select the Leave Type"
                        disabled={loadingFetchTimeoffTypes}
                        loading={loadingFetchTimeoffTypes}
                        mode="multiple"
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      >
                        {typeList.map((item = {}) => {
                          return (
                            <Option key={item.name} value={item.ids}>
                              {item.name}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row
            gutter={[24, 24]}
            style={{
              marginTop: 16,
            }}
          >
            <Col xs={{ span: 1 }}>
              <span className={styles.itemStatusLabel}>Status</span>
            </Col>
            <Col xs={{ span: 22 }} className={styles.statusFilter}>
              <Form.Item name="status" className={styles.statusRow}>
                <Checkbox.Group options={TIMEOFF_NAME_BY_ID} disabled={disabled} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};
export default connect(({ loading, timeOffManagement }) => ({
  loadingEmployeeList: loading.effects['timeOffManagement/getListEmployeesEffect'],
  loadingFetchTimeoffTypes: loading.effects['timeOffManagement/getTimeOffTypeListEffect'],
  timeOffManagement,
}))(Header);
