import React, { useEffect } from 'react';
import SmallDownArrow from '@/assets/dashboard/smallDownArrow.svg';
import ContentPopover from './components/ContentPopover';
import styles from './index.less';

const LocationDropdownSelector = ({
  data = [],
  label = 'Location',
  selectedLocations = [],
  saveLocationToRedux = () => {},
}) => {
  const [dataLength, setDataLength] = React.useState(0);
  const [selectedLocationsLength, setSelectedLocationsLength] = React.useState(0);

  // functions
  const onCheck = (selection = []) => {
    const temp = selection.filter((x) => typeof x !== 'number');
    saveLocationToRedux(temp);
  };

  const onCheckAll = (e) => {
    if (e.target.checked) {
      let allDataTemp = [];
      data.forEach((item) => {
        const { children = [] } = item;
        allDataTemp = [...allDataTemp, ...children.map((x) => x.key)];
      });
      saveLocationToRedux(allDataTemp);
    } else {
      saveLocationToRedux([]);
    }
  };

  useEffect(() => {
    let dataLengthTemp = 0;
    data.forEach((item) => {
      const { children = [] } = item;
      dataLengthTemp += children.length;
    });
    setDataLength(dataLengthTemp);
  }, [JSON.stringify(data)]);

  useEffect(() => {
    const ids = selectedLocations.map((x) => typeof x !== 'number');
    setSelectedLocationsLength(ids.length);
  }, [JSON.stringify(selectedLocations)]);

  // render UI
  const getSelectedLocationName = () => {
    if (selectedLocationsLength === 1) {
      let name = '';
      data.forEach((item) => {
        const { children = [] } = item;
        const find = children.find((child) => child.key === selectedLocations[0])?.title;
        if (find) {
          name = find;
        }
      });
      return name;
    }
    if (selectedLocationsLength > 0 && selectedLocationsLength < dataLength) {
      return `${selectedLocations.length} ${label.toLowerCase()}s selected`;
    }

    if (dataLength === selectedLocationsLength) {
      return 'All';
    }
    return 'None';
  };

  return (
    <div className={styles.LocationDropdownSelector}>
      <span className={styles.label}>{label}</span>
      <ContentPopover
        data={data}
        checkAll={dataLength === selectedLocationsLength}
        selected={selectedLocations}
        onCheck={onCheck}
        onCheckAll={onCheckAll}
      >
        <div
          className={`${data.length < 2 ? styles.noDropdown : styles.dropdown}`}
          onClick={(e) => e.preventDefault()}
        >
          <span>{getSelectedLocationName()}</span>
          {data.length < 2 ? null : <img src={SmallDownArrow} alt="" />}
        </div>
      </ContentPopover>
    </div>
  );
};
export default LocationDropdownSelector;
