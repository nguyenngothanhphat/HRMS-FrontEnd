import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import BirthdayImage from '@/assets/homePage/birthday.png';
import BirthdayImage2 from '@/assets/homePage/birthday2.png';
import BirthdayImage3 from '@/assets/homePage/birthday3.png';
import BirthdayImage4 from '@/assets/homePage/birthday4.png';
import CongratulationImage from '@/assets/homePage/congratulation.png';
import { CELEBRATE_TYPE } from '@/utils/homePage';
import Card from './components/Card';
import styles from './index.less';

const avatars = [BirthdayImage, BirthdayImage2, BirthdayImage3, BirthdayImage4];

const Celebrating = (props) => {
  const { dispatch, homePage: { celebrationList = [] } = {} } = props;
  const [list, setList] = useState([]);

  const fetchCelebrationList = () => {
    return dispatch({
      type: 'homePage/fetchCelebrationList',
    });
  };

  useEffect(() => {
    fetchCelebrationList();
  }, []);

  const compare = (a, b) => {
    if (moment(a) > moment(b)) return 1;
    if (moment(a) < moment(b)) return -1;
    return 0;
  };

  const isPastDate = (date1, date2) => {
    return moment(date1).isBefore(moment(date2), 'day');
  };

  const addCurrentYearToExistingDate = (date) => {
    const currentYear = moment().format('YYYY');
    return moment(
      `${currentYear}/${moment.utc(date).format('MM')}/${moment.utc(date).format('DD')}`,
      'YYYY/MM/DD',
    );
  };

  const formatData = () => {
    let tempList = JSON.parse(JSON.stringify(celebrationList));

    let avatarIndex = 0;
    tempList = tempList.map((x) => {
      const { type = '' } = x;
      if (!x.generalInfoInfo?.avatar) {
        avatarIndex += 1;
        return {
          ...x,
          generalInfoInfo: {
            ...x.generalInfoInfo,
            avatar:
              type === CELEBRATE_TYPE.BIRTHDAY
                ? avatars[avatarIndex % avatars.length]
                : CongratulationImage,
          },
        };
      }
      return x;
    });

    let birthdayList = tempList.filter((x) => x.type === CELEBRATE_TYPE.BIRTHDAY);
    const anniversaryList = tempList.filter((x) => x.type === CELEBRATE_TYPE.ANNIVERSARY);
    const newJoineeList = tempList.filter((x) => x.type === CELEBRATE_TYPE.NEWJOINEE);

    // birthday
    birthdayList = [
      ...birthdayList.filter((x) => {
        return !isPastDate(moment(addCurrentYearToExistingDate(x.generalInfoInfo?.DOB)), moment());
      }),
    ];

    birthdayList.sort((a, b) =>
      compare(
        moment(addCurrentYearToExistingDate(a.generalInfoInfo.DOB)),
        moment(addCurrentYearToExistingDate(b.generalInfoInfo.DOB)),
      ),
    );

    // anniversary
    anniversaryList.sort((a, b) =>
      compare(
        moment(addCurrentYearToExistingDate(a.joinDate)),
        moment(addCurrentYearToExistingDate(b.joinDate)),
      ),
    );

    setList([...birthdayList, ...anniversaryList, ...newJoineeList]);
  };

  useEffect(() => {
    formatData();
  }, [JSON.stringify(celebrationList)]);

  return (
    <div className={styles.Celebrating}>
      <p className={styles.titleText}>Lets celebrate</p>
      <Card list={list} refreshData={fetchCelebrationList} />
    </div>
  );
};

export default connect(({ homePage, user: { currentUser = {}, permissions = {} } = {} }) => ({
  currentUser,
  permissions,
  homePage,
}))(Celebrating);
