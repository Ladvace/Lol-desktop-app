import { combineReducers } from "redux";
import * as ActionTypes from "./actionTypes";

function sounds(state = true, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SOUNDS:
      return action.sounds;
    default:
      return state;
  }
}

// 0 is stable, 1 is beta
function releaseChannel(state = 0, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_RELEASE_CHANNEL:
      return action.releaseChannel;
    default:
      return state;
  }
}

// 0 is stable, 1 is beta
function concurrentDownloads(state = 3, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_CONCURRENT_DOWNLOADS:
      return action.concurrentDownloads;
    default:
      return state;
  }
}

function discordRPC(state = true, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_DISCORD_RPC:
      return action.val;
    default:
      return state;
  }
}

function hideWindowOnGameLaunch(state = false, action) {
  switch (action.type) {
    case ActionTypes.HIDE_WINDOW_ON_GAME_LAUNCH:
      return action.hideWindow;
    default:
      return state;
  }
}

function potatoPcMode(state = false, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_POTATO_PC_MODE:
      return action.value;
    default:
      return state;
  }
}

function showNews(state = true, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_SHOW_NEWS:
      return action.value;
    default:
      return state;
  }
}

// 1 is stable, 2 is beta, 3 is alpha
function curseReleaseChannel(state = 1, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_CURSE_RELEASE_CHANNEL:
      return action.curseReleaseChannel;
    default:
      return state;
  }
}

function minecraftSettings(
  state = { resolution: { height: 480, width: 854 } },
  action
) {
  switch (action.type) {
    case ActionTypes.UPDATE_MINECRAFT_RESOLUTION:
      return {
        ...state,
        resolution: { ...state.resolution, ...action.resolution },
      };
    default:
      return state;
  }
}

export default combineReducers({
  sounds,
  releaseChannel,
  concurrentDownloads,
  discordRPC,
  hideWindowOnGameLaunch,
  potatoPcMode,
  showNews,
  curseReleaseChannel,
  minecraftSettings,
});
