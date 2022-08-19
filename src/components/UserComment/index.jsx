import { Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import DefaultAvatar from '@/assets/avtDefault.jpg';
import UpdateIcon from '@/assets/editMailExit.svg';
import DislikeIcon from '@/assets/homePage/dislike.svg';
import DislikedIcon from '@/assets/homePage/disliked.svg';
import LikeIcon from '@/assets/homePage/like.svg';
import LikedIcon from '@/assets/homePage/liked.svg';
import MenuIcon from '@/assets/homePage/menuDots.svg';
import DeleteIcon from '@/assets/relievingDel.svg';
import CommentBox from '@/components/CommentBox';
import { hashtagify, urlify } from '@/utils/homePage';

import { DATE_FORMAT, LIKE_ACTION, POST_OR_CMT, TAB_IDS } from '@/constants/homePage';
import MenuPopover from '../MenuPopover';
import styles from './index.less';

const UserComment = ({
  dispatch,
  postId = '',
  item = {},
  onEditComment = () => {},
  onRemoveComment = () => {},
  isMe = false,
  isEdit = false,
  onEditSubmit = () => {},
  onEditCancel = () => {},
  refreshComments = () => {},
  setActivePostID = () => {},
  getCommentReactionListEffect = () => {},
  setViewingPostOrCommentLiked = () => {},
  setIsLikeOrDislike = () => {},
  setIsReactPostOrCmt = () => {},
  hasPermission = false,
  varName = TAB_IDS.ANNOUNCEMENTS,
}) => {
  const { _id: commentId = '', content = '', employee: owner = {}, totalReact = {} } = item;

  const [commentValue, setCommentValue] = useState('');
  const [time, setTime] = useState('');

  const reactCommentEffect = (commentIdProp, type) => {
    const dispatchType =
      varName === TAB_IDS.ANNIVERSARY
        ? 'homePage/reactAnniversaryEffect'
        : 'homePage/reactPostEffect';
    return dispatch({
      type: dispatchType,
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

  const menuItems = [
    {
      label: 'Edit',
      onClick: () => {
        onEditComment(commentId);
      },
      icon: UpdateIcon,
      visible: isMe,
    },
    {
      label: 'Delete',
      onClick: () => {
        onRemoveComment(commentId);
      },
      icon: DeleteIcon,
      visible: isMe,
    },
  ];

  // function
  const onLikeComment = async (type) => {
    setIsReactPostOrCmt(POST_OR_CMT.COMMENT);
    setActivePostID(postId);
    const res = await reactCommentEffect(commentId, type);
    if (res.statusCode === 200) {
      await refreshComments();
      setIsReactPostOrCmt('');
    }
  };

  const onViewWhoLiked = (type) => {
    setIsLikeOrDislike(type);
    setViewingPostOrCommentLiked({
      id: item?._id,
      type: POST_OR_CMT.COMMENT,
    });
    getCommentReactionListEffect(commentId, type);
  };

  const renderLikeBtn = () => {
    const liked = item.react === LIKE_ACTION.LIKE;
    const disliked = item.react === LIKE_ACTION.DISLIKE;
    const likeCount = totalReact?.asObject?.[LIKE_ACTION.LIKE] || 0;
    const dislikeCount = totalReact?.asObject?.[LIKE_ACTION.DISLIKE] || 0;

    return (
      <div className={styles.likes} style={{ pointerEvents: isEdit ? 'none' : 'auto' }}>
        <div className={liked ? styles.likes__pressed : null}>
          <img
            src={liked ? LikedIcon : LikeIcon}
            alt=""
            onClick={() => onLikeComment(LIKE_ACTION.LIKE)}
          />
          <span onClick={() => onViewWhoLiked(LIKE_ACTION.LIKE)}>
            {likeCount} {likeCount > 1 ? 'Likes' : 'Like'}
          </span>
        </div>
        <div className={disliked ? styles.likes__pressed : null}>
          <img
            src={disliked ? DislikedIcon : DislikeIcon}
            alt=""
            onClick={() => onLikeComment(LIKE_ACTION.DISLIKE)}
          />
          <span onClick={() => onViewWhoLiked(LIKE_ACTION.DISLIKE)}>
            {dislikeCount} {dislikeCount > 1 ? 'Dislikes' : 'Dislike'}
          </span>
        </div>
      </div>
    );
  };

  const renderContent = (text) => {
    const temp = urlify(text);
    return hashtagify(temp);
  };

  return (
    <div className={styles.UserComment}>
      <div
        className={styles.author}
        style={{
          borderColor: isMe ? '#2c6df9' : '#f1f1f1',
        }}
      >
        <img
          src={owner?.generalInfoInfo?.avatar || DefaultAvatar}
          alt=""
          style={{
            backgroundColor: isMe ? '#f1f1f1' : 'transparent',
          }}
          onError={(e) => {
            e.target.src = DefaultAvatar;
          }}
        />
      </div>

      <div
        className={styles.content}
        style={isEdit ? { borderColor: '#2c6df9', backgroundColor: '#f1f2f356' } : null}
      >
        <div className={styles.top}>
          <div className={styles.authorName}>
            <Link to={`/directory/employee-profile/${owner?.generalInfoInfo?.userId}`}>
              {owner?.generalInfoInfo?.legalName || 'Unknown'}
            </Link>

            <Tooltip
              placement="right"
              title={moment(item.createdAt).locale('en').format(DATE_FORMAT)}
            >
              <span className={styles.time}>{time}</span>
            </Tooltip>
            <span className={styles.title}>{owner?.titleInfo?.name || 'Unknown'}</span>
          </div>
          {!isEdit && (isMe || hasPermission) && (
            <div className={styles.menu}>
              <MenuPopover items={menuItems}>
                <img src={MenuIcon} alt="" style={{ cursor: 'pointer', padding: '4px 10px' }} />
              </MenuPopover>
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
          <p>{renderContent(content)}</p>
        )}

        {renderLikeBtn()}
      </div>
    </div>
  );
};

export default connect(() => ({}))(UserComment);
