import React, { useState } from 'react';
import styles from './styles.less';
import FirstStep from './components/FirstStep';
import SecondStep from './components/SecondStep';
import ThirdStep from './components/ThirdStep';
import FourthStep from './components/FourthStep';

export default function HandleChanges(props) {
  const { current } = props;
  const [radio, setRadio] = useState(1);
  const onRadioChange = (e) => {
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
    </div>
  );
}
