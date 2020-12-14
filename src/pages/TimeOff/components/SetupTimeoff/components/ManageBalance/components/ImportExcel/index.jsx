import React from 'react';
import * as XLSX from 'xlsx';

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
      console.log(`Data>>>${data}`); // shows that excel data is read
      console.log(this.convertToJson(data)); // shows data in json format
    };
    reader.readAsBinaryString(f);
  };

  convertToJson = (csv) => {
    const lines = csv.split('\n');

    const result = [];

    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i += 1) {
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j += 1) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    // return result; //JavaScript object
    return JSON.stringify(result); // JSON
  };

  render() {
    return (
      <div>
        <input type="file" id="file" ref="fileUploader" onChange={this.filePathset.bind(this)} />
        <button
          onClick={() => {
            this.readFile();
          }}
        >
          Read File
        </button>
      </div>
    );
  }
}

export default ExcelToJson;
