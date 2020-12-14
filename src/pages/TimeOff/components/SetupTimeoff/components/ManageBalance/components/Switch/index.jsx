import React, { PureComponent } from 'react';
import icon from '@/assets/svgIcon.svg';
import ImportCSV from '../ImportExcel';
import ExportCSV from '../ExportExel';
import styles from './index.less';

class Switch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fileName: 'dsfffdsfds',
      customers: [
        {
          name: 'ds',
          ange: 'fd',
        },
        {
          name: 'ds',
          ange: 'ffdfdsfdsd',
          minh: 'dsfafsde',
        },
      ],
    };
  }

  handleDataUpload = (data) => {
    const employees = data.map((item) => {
      return {
        employeeId: item.name,
        firstName: item.ange,
      };
    });
    console.log(employees);
  };

  render() {
    const { customers, fileName } = this.state;
    return (
      <div className={styles.root}>
        <div>Switch</div>
        <div>Keep current employee timeoff balances, but move them to new policies</div>
        <img src={icon} alt="" />
        <div>
          <ExportCSV csvData={customers} fileName={fileName} />
        </div>
        <ImportCSV />
      </div>
    );
  }
}
export default Switch;
