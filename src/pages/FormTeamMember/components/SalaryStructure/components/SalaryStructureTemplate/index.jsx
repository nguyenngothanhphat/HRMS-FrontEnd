import React, { PureComponent } from 'react';
import { Select, Form, Table, Button } from 'antd';
import { formatMessage } from 'umi';

import styles from './index.less';

export default class SalaryStructureTemplate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isEditted: false,
      tableData: [
        {
          shortName: 'A',
          title: 'Basic',
          value: 'RS.12888',
          isActive: false,
          isEnableToEdit: true,
        },
        {
          shortName: 'B',
          title: 'HRA',
          value: '50% of Basic',
          isActive: false,
          isEnableToEdit: true,
        },
        {
          shortName: 'C',
          title: 'Other allowances',
          value: 'Balance amount',
          isActive: false,
          isEnableToEdit: false,
        },
        {
          shortName: 'D',
          title: 'Total earning (Gross)',
          value: 'A + B + C',
          isActive: true,
          isEnableToEdit: false,
        },
        {
          shortName: '',
          title: 'Deductions',
          value: '',
          isActive: true,
          isEnableToEdit: false,
        },
        {
          shortName: 'G',
          title: `Employee's DF`,
          value: '12% of Basic',
          isActive: false,
          isEnableToEdit: true,
        },
        {
          shortName: 'H',
          title: `Employee's ESI`,
          value: '0.75% of Gross',
          isActive: false,
          isEnableToEdit: true,
        },
        {
          shortName: 'I',
          title: 'Professional Tax',
          value: 'Rs.200',
          isActive: false,
          isEnableToEdit: false,
        },
        {
          shortName: 'J',
          title: 'TDS',
          value: 'As per IT rules',
          isActive: false,
          isEnableToEdit: false,
        },
        {
          shortName: null,
          title: 'Net payment',
          value: 'F - (G + H + I + J)',
          isActive: true,
          isEnableToEdit: false,
        },
      ],
      salaryTemplate: [
        {
          id: 0,
          name: 'UX Designer',
          value: 'UX Designer',
        },
        {
          id: 1,
          name: 'Business Development',
          value: 'Business Development',
        },
      ],
      footerData: [
        {
          name: 'Employer’s PF',
          value: '12% of Basic',
        },
        {
          name: 'Employer’s ESI',
          value: '3.75% of Gross',
        },
      ],
    };
  }

  _renderTableTitle = (shortName) => {
    const { tableData } = this.state;
    const data = tableData.find((item) => item.shortName === shortName);
    const { isActive, title } = data;
    return (
      <span
        className={`${isActive === true ? `blue-text` : null} ${
          shortName === null ? `big-text` : null
        }`}
      >
        {title}
      </span>
    );
  };

  _renderTableValue = (shortName) => {
    const { tableData, isEditted } = this.state;
    const data = tableData.find((item) => item.shortName === shortName);
    const { isActive, value } = data;
    if (!isEditted) {
      return (
        <span
          className={`${isActive === true ? `blue-text` : null} ${
            shortName === null ? `big-text` : null
          }`}
        >
          {value}
        </span>
      );
    }
    return 'input';
  };

  _renderColumns = () => {
    const columns = [
      {
        title: '',
        dataIndex: 'shortName',
        key: 'title',
        width: '40%',
        render: (shortName) => this._renderTableTitle(shortName),
      },
      {
        title: '',
        dataIndex: 'shortName',
        key: 'shortName',
        width: '10%',
      },
      {
        title: '',
        dataIndex: 'shortName',
        key: 'value',
        className: 'thirdColumn',
        width: '50%',
        render: (shortName) => this._renderTableValue(shortName),
      },
      // {
      //   title: 'Action',
      //   dataIndex: 'action',
      //   key: 'action',
      //   render: () => (
      //     <a href="#">{formatMessage({ id: 'component.customEmailsTableField.viewEmail' })}</a>
      //   ),
      // },
    ];
    return columns;
  };

  _renderFooter = () => {
    const { footerData } = this.state;
    return (
      <div className={styles.salaryStructureTemplate_footer}>
        {footerData.map((data) => {
          return (
            <div className={styles.salaryStructureTemplate_footer_info}>
              <p className={styles.title}>{data.name}</p>
              <p className={styles.value}>{data.value}</p>
            </div>
          );
        })}
      </div>
    );
  };

  _renderButtons = () => {
    const { isEditted } = this.state;
    return (
      <Form.Item>
        {isEditted === true ? (
          <Button htmlType="submit" type="primary" onClick={this.onClickEdit}>
            Done
          </Button>
        ) : (
          <Button type="primary" onClick={this.onClickEdit}>
            Edit
          </Button>
        )}
      </Form.Item>
    );
  };

  onClickEdit = () => {
    const { isEditted } = this.state;
    this.setState({
      isEditted: !isEditted,
    });
  };

  onClickSubmit = () => {
    const { isEditted } = this.state;
    this.setState({
      isEditted: !isEditted,
    });
  };

  render() {
    const { Option } = Select;
    const { salaryTemplate, tableData } = this.state;
    return (
      <div className={styles.salaryStructureTemplate}>
        <Form onFinish={this.onFinish}>
          {' '}
          <div className={styles.salaryStructureTemplate_select}>
            <Form.Item label="Select a salary structure template" name="salaryTemplate">
              <Select size="large" style={{ width: 280 }}>
                {salaryTemplate.map((template) => {
                  return (
                    <Option key={template.shortName} value={template.value}>
                      {template.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
          {this._renderButtons()}
          <div className={styles.salaryStructureTemplate_table}>
            <Table
              dataSource={tableData}
              columns={this._renderColumns()}
              size="middle"
              pagination={false}
            />
          </div>
          {this._renderFooter()}
        </Form>
      </div>
    );
  }
}
