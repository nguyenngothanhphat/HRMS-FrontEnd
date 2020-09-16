import React, { useState } from 'react';
import styles from './styles.less';
import FirstStep from './components/FirstStep';
import SecondStep from './components/SecondStep';
import ThirdStep from './components/ThirdStep';
import FourthStep from './components/FourthStep';
import FifthStep from './components/FifthStep';

export default function HandleChanges(props) {
  const { current, data } = props;
  const [radio, setRadio] = useState(1);
  const [changeData, setChangeData] = useState({
    stepOne: radio,
    stepTwo: {
      title: '',
      wLocation: '',
      employType: '',
      compenType: '',
      annual: '',
    },
    stepThree: {
      department: '',
      position: '',
      reportTo: '',
    },
    stepFour: [],
    stepFive: {
      promotedTo: '',
      newSalary: Number,
      location: '',
    },
  });
  const onRadioChange = (e, info) => {
    console.log(e.target.value, info);
    setRadio(e.target.value);
  };
  function onChange(value, type) {
    console.log(`selected ${value}`);
    console.log(`selected ${type}`);
  }
  function onSearch(value) {
    console.log('searched: ', value);
  }

  return (
    <div className={styles.handleChanges}>
      {current === 0 ? <FirstStep onRadioChange={onRadioChange} radio={radio} /> : null}
      {current === 1 ? <SecondStep onChange={onChange} onSearch={onSearch} /> : null}
      {current === 2 ? <ThirdStep onChange={onChange} onSearch={onSearch} /> : null}
      {current === 3 ? <FourthStep onRadioChange={onRadioChange} radio={radio} /> : null}
      {current === 4 ? (
        <FifthStep
          name={data.name}
          currentData={{ title: data.title, salary: data.annualSalary, location: data.location }}
          data={{
            newTitle: changeData.stepTwo.title,
            newSalary: changeData.stepTwo.annual,
            newLocation: changeData.stepTwo.wLocation,
          }}
        />
      ) : null}
    </div>
  );
}
