import { DownloadOutlined } from '@ant-design/icons';
import React from 'react';
import exportToCsv from '@/utils/exportToCsv';
import s from './index.less';

class DownloadEmployeeTemplate extends React.PureComponent {
  downloadTemplate = () => {
    const exportData = [
      {
        employeeId: 'PSI 0000',
        firstName: 'First Name',
        lastName: 'Last Name',
        joinDate: '11/30/2020',
        location: 'Vietnam',
        department: 'Develop',
        title: 'Junior Frontend',
        workEmail: 'template@terralogic.com',
        personalEmail: 'template@gmail.com',
        managerWorkEmail: 'manager@terralogic.com',
        personalNumber: '0123456789',
      },
    ];
    exportToCsv('Template_Import_Employees.csv', this.processData(exportData));
  };

  processData = (array) => {
    // Uppercase first letter
    let capsPopulations = [];
    capsPopulations = array.map((item) => {
      return {
        'Employee Id': item.employeeId,
        'First Name': item.firstName,
        'Last Name': item.lastName,
        'Joined Date': item.joinDate,
        Location: item.location,
        Department: item.department,
        Title: item.title,
        'Work Email': item.workEmail,
        'Personal Email': item.personalEmail,
        'Manager Work Email': item.managerWorkEmail,
        'Personal Number': item.personalNumber,
      };
    });

    // Get keys, header csv
    const keys = Object.keys(capsPopulations[0]);
    const dataExport = [];
    dataExport.push(keys);

    // Add the rows
    capsPopulations.forEach((obj) => {
      const value = `${keys.map((k) => obj[k]).join('_')}`.split('_');
      dataExport.push(value);
    });

    return dataExport;
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.viewIconDownload}>
          <div className={s.viewIconDownload__circle}>
            <DownloadOutlined className={s.viewIconDownload__circle__icon} />
          </div>
        </div>
        <p className={s.title}>Employee Data Template</p>
        <p className={s.text}>Setup all employee data at once</p>
        <p className={s.text}>Once you have filled the all the employee data in the spreadsheet</p>
        <p className={s.download} onClick={this.downloadTemplate}>
          Download template
        </p>
      </div>
    );
  }
}

export default DownloadEmployeeTemplate;
