import React from 'react';
import { Button, DatePicker, Row, Col } from 'antd';
import * as XLSX from 'xlsx';
import styles from './index.less';

class ExcelToJson extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
    };
  }

  handleClick = () => {
    this.refs.fileUploader.click();
  };

  filePathset = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file);
    this.setState({ file });
  };

  readFile = () => {
    const { file: f = {} } = this.state;
    const { name } = f;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      console.log(data); // shows that excel data is read
      console.log(this.convertToJson(data)); // shows data in json format
    };

    reader.readAsBinaryString(f);
  };

  convertToJson = (csv) => {
    console.log(csv, 'csv');
    const lines = csv.split('\n');
    console.log(lines, 'line');
    const result = [];

    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i += 1) {
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j += 1) {
        obj[headers[j]] = currentline[j];
      }
      console.log(obj);
      result.push(obj);
    }

    // return result; //JavaScript object
    return JSON.stringify(result); // JSON
  };

  render() {
    return (
      <div className={styles.root}>
        <div className={styles.import}>
          <input
            type="file"
            id="file"
            ref="fileUploader"
            onChange={this.filePathset.bind(this)}
            accept=".xlsx"
          />
        </div>
        <Row gutter={[50, 0]}>
          <Col span={10}>As per any assigned new policies, their accrual will begin on:</Col>
          <Col span={7}>
            <DatePicker />
          </Col>
        </Row>
        <div className={styles.save}>
          <Button
            className={styles.btnSave}
            onClick={() => {
              this.readFile();
            }}
          >
            Read File
          </Button>
        </div>
      </div>
    );
  }
}

export default ExcelToJson;
