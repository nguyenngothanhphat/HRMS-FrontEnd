import { Popover, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import DislikeIcon from '@/assets/homePage/dislike.svg';
import DislikedIcon from '@/assets/homePage/disliked.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import LikedIcon from '@/assets/homePage/liked.svg';
import MenuIcon from '@/assets/homePage/menuDots.svg';
import DefaultAvatar from '@/assets/defaultAvatar.png';
import CommentBox from '@/components/CommentBox';
import { dateFormat, LIKE_ACTION, urlify } from '@/utils/homePage';
import styles from './index.less';

const UserComment = ({
  dispatch,
  item = {},
  onEditComment = () => {},
  onRemoveComment = () => {},
  isMe = false,
  currentUser = {},
  isEdit = false,
  onEditSubmit = () => {},
  onEditCancel = () => {},
}) => {
  const { employee = {} } = currentUser;
  const { _id: commentId = '', content = '', employee: owner = {}, totalReact = {} } = item;

  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [time, setTime] = useState('');

  const reactCommentEffect = (commentIdProp, type) => {
    return dispatch({
      type: 'homePage/reactPostEffect',
      payload: {
        comment: commentIdProp,
        type,
      },
    });
  };

  useEffect(() => {
    if (isEdit) {
      setCommentValue(content);
    }
  }, [isEdit]);

  useEffect(() => {
    moment.locale('en', {
      relativeTime: {
        future: '%s left',
        past: '%s ago',
        s: 'seconds',
        ss: '%ss',
        m: 'a minute',
        mm: '%dm',
        h: 'an hour',
        hh: '%dh',
        d: 'a day',
        dd: '%dd',
        M: 'a month',
        MM: '%dM',
        y: 'a year',
        yy: '%dY',
      },
    });
    const timeTemp = moment(item.createdAt).fromNow();
    setTime(timeTemp);
  }, []);

  const renderMenuDropdown = () => {
    return (
      <div className={styles.containerDropdown}>
        <div
          className={styles.btn}
          onClick={() => {
            onEditComment(commentId);
            setDropDownVisible(false);
          }}
        >
          <span>Edit</span>
        </div>
        <div
          className={styles.btn}
          onClick={() => {
            onRemoveComment(commentId);
            setDropDownVisible(false);
          }}
        >
          <span>Delete</span>
        </div>
      </div>
    );
  };

  // function
  const onLikeComment = () => {
    if (likes.includes(employee?._id)) {
      setLikes(likes.filter((x) => x !== employee?._id));
    } else {
      setLikes([...likes, employee?._id]);
      setDislikes(dislikes.filter((x) => x !== employee?._id));
    }
    reactCommentEffect(commentId, LIKE_ACTION.LIKE);
  };

  const onDislikeComment = () => {
    if (dislikes.includes(employee?._id)) {
      setDislikes(dislikes.filter((x) => x !== employee?._id));
    } else {
      setDislikes([...dislikes, employee?._id]);
      setLikes(likes.filter((x) => x !== employee?._id));
    }
    reactCommentEffect(commentId, LIKE_ACTION.DISLIKE);
  };

  const renderLikeBtn = () => {
    const liked = likes.includes(employee?._id);
    const disliked = dislikes.includes(employee?._id);

    return (
      <div className={styles.likes} style={{ pointerEvents: isEdit ? 'none' : 'auto' }}>
        <div onClick={onLikeComment} className={liked ? styles.likes__pressed : null}>
          <img src={liked ? LikedIcon : LikeIcon} alt="" />
          <span>{totalReact?.asObject?.[LIKE_ACTION.LIKE] || 0}</span>
        </div>
        <div onClick={onDislikeComment} className={disliked ? styles.likes__pressed : null}>
          <img src={disliked ? DislikedIcon : DislikeIcon} alt="" />
          <span>{totalReact?.asObject?.[LIKE_ACTION.DISLIKE] || 0}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.UserComment}>
      <div className={styles.author}>
        <img
          src={owner?.generalInfoInfo?.avatar || DefaultAvatar}
          alt=""
          style={{
            borderColor: isMe ? '#f50' : 'transparent',
            backgroundColor: isMe ? '#f50' : 'transparent',
          }}
        />
      </div>

      <div
        className={styles.content}
        style={isEdit ? { borderColor: '#00C59880', backgroundColor: '#f1f2f356' } : null}
      >
        <div className={styles.top}>
          <div className={styles.authorName}>
            <Link to={`/directory/employee-profile/${owner?.generalInfoInfo?.userId}`}>
              {owner?.generalInfoInfo?.legalName || 'Lewis Doe'}
            </Link>

            <Tooltip
              placement="right"
              title={moment(item.createdAt).locale('en').format(dateFormat)}
            >
              <span className={styles.time}>{time}</span>
            </Tooltip>
            <span className={styles.title}>{owner?.titleInfo?.name || 'Frontend Developer'}</span>
          </div>
          {!isEdit && isMe && (
            <div className={styles.menu}>
              <Popover
                trigger="click"
                overlayClassName={styles.dropdownPopover}
                content={renderMenuDropdown()}
                visible={dropDownVisible}
                onVisibleChange={(visible) => setDropDownVisible(visible)}
                placement="bottomRight"
              >
                <img src={MenuIcon} alt="" style={{ cursor: 'pointer', padding: '4px 10px' }} />
              </Popover>
            </div>
          )}
        </div>

        {isEdit ? (
          <CommentBox
            onChange={setCommentValue}
            value={commentValue}
            onSubmit={() => onEditSubmit(commentValue)}
            onCancel={onEditCancel}
            isEdit={isEdit}
          />
        ) : (
          <p>{urlify(content)}</p>
        )}

        {renderLikeBtn()}
      </div>
    </div>
  );
};

export default connect(() => ({}))(UserComment);
