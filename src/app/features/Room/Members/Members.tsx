import { useAppDispatch, useAppSelector } from '@core/store/hooks';
import { setSuccess } from '@core/store/snackbarMessageSlice';
import { RoomMember, RoomRole } from '@core/useFirebase/models';
import { useFirebase } from '@core/useFirebase/useFirebase';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import useTheme from '@material-ui/core/styles/useTheme';
import SvgIcon from '@material-ui/core/SvgIcon';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { FlexLayout } from 'la-danze-ui';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ReactComponent as CrownIcon } from './crown-solid.svg';
import './Members.scss';

export function Members(): JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const memberList = useAppSelector((state) => state.room.value.memberList);
  const dispatch = useAppDispatch();

  const handleCopy = async () => {
    await copyChareLink();
    dispatch(setSuccess(t('room.members.shareLinkCopied')));
  };

  return (
    <FlexLayout flexDirection="column" className="Members" alignItems={`${matches ? 'center' : 'flex-start'}`}>
      <div>
        <Typography variant="h6" className="title">
          {t('room.members.title')}
        </Typography>
        {memberList.map((member) => (
          <Member key={member.uid} member={member} />
        ))}
        <Tooltip title={`${t('room.members.copyToClipboard')}`} placement="right">
          <Button
            size="small"
            className="shareLink"
            variant="outlined"
            color="secondary"
            startIcon={
              <SvgIcon className="crown" style={{ fontSize: '1rem' }}>
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
              </SvgIcon>
            }
            onClick={handleCopy}
          >
            {t('room.members.shareLink')}
          </Button>
        </Tooltip>
      </div>
    </FlexLayout>
  );
}

function Member({ member }: { member: RoomMember }): JSX.Element {
  const currentUser = useAppSelector((state) => state.auth.value.currentUser);
  return (
    <div className="Member">
      <MemberStatus member={member} />
      <Typography className={`username ${currentUser?.uid === member.uid ? 'me' : ''}`} variant="body1">
        {member.username}
      </Typography>
      {member.role === RoomRole.Moderator && (
        <SvgIcon className="crown" fontSize="small">
          <CrownIcon />
        </SvgIcon>
      )}
    </div>
  );
}

const roleList = [RoomRole.Moderator, RoomRole.Voter, RoomRole.Viewer];

function MemberStatus({ member }: { member: RoomMember }): JSX.Element {
  const { t } = useTranslation();
  const { roomId } = useParams<{ roomId: string }>();
  const { setRole } = useFirebase(roomId);
  const currentUser = useAppSelector((state) => state.auth.value.currentUser);
  const currentRoom = useAppSelector((state) => state.room.value);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRole, setSelectedRole] = useState(member.role);

  const open = Boolean(anchorEl);
  const roleListFiltered = roleList.filter((item) => {
    if (item === RoomRole.Moderator && currentRoom.currentRole !== RoomRole.Moderator) {
      return false;
    }
    return true;
  });

  const getVoteStatus = () => {
    if (member.role === RoomRole.Viewer) {
      return (
        <SvgIcon fontSize="small">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
        </SvgIcon>
      );
    }
    if (!member.hasVoted) {
      return <Typography variant="body1">...</Typography>;
    }
    if (currentRoom.currentVoting?.isOpen) {
      return (
        <SvgIcon fontSize="small">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </SvgIcon>
      );
    }
    return (
      <Typography className="value" variant="body1">
        {currentRoom.currentVoting?.votes[member.uid]}
      </Typography>
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (canChangeRole()) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (role: RoomRole) => {
    if (currentRoom.currentVoting) {
      setRole(currentRoom.currentVoting.votingId, member.uid, role);
      setSelectedRole(role);
      setAnchorEl(null);
    }
  };

  const canChangeRole = () => {
    if (currentRoom.currentRole === RoomRole.Moderator && member.uid === currentUser?.uid) {
      return false;
    }
    if (member.uid === currentUser?.uid) {
      return true;
    }
    return currentRoom.currentRole === RoomRole.Moderator;
  };

  return (
    <>
      <div
        className={`MemberStatus ${canChangeRole() ? 'pointer' : ''}`}
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <span className={`onlineStatus ${member.isOnline ? 'online' : 'offline'}`} />
        <span className={`voteStatus ${member.role !== RoomRole.Viewer && !member.hasVoted ? 'waiting' : ''}`}>
          {getVoteStatus()}
        </span>
      </div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        {roleListFiltered.map((role) => (
          <MenuItem key={role} selected={role === member?.role} onClick={() => handleMenuItemClick(role)}>
            {t(`room.members.memberStatus.${role}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

function copyChareLink(): Promise<void> {
  const textArea = document.createElement('textarea');
  textArea.value = window.location.href;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (err) {
    console.error('Error copy: ', err);
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
}
