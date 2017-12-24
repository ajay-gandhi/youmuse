import { ACTION_TYPES, INITIAL_STATE, REPEAT_STATE } from "./constants";
import {
  MAX_QUEUE_SIZE,
  createQueue,
  refillQueue,
  removeFromQueueByIndex,
  removeFromQueueById,
  copyArray
} from "./QueueUtils";

// Reducer
const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.setSearchQuery:
      return {
        ...state,
        searchQuery: action.searchQuery,
      };

    case ACTION_TYPES.toggleRepeat: {
      let repeat = state.repeat === REPEAT_STATE.off
        ? REPEAT_STATE.all
        : (state.repeat === REPEAT_STATE.all ? REPEAT_STATE.one : REPEAT_STATE.off);
      return {
        ...state,
        repeat,
        ...createQueue(state.playlist, state.currentSong, state.shuffle, repeat, state.queue),
      };
    }

    case ACTION_TYPES.toggleShuffle:
      return {
        ...state,
        shuffle: !state.shuffle,
        ...createQueue(state.playlist, state.currentSong, state.shuffle, state.repeat, state.queue),
      };

    case ACTION_TYPES.updateVolume:
      return {
        ...state,
        volume: action.volume,
      };

    case ACTION_TYPES.updateCurrentTime:
      return {
        ...state,
        currentTime: action.currentTime,
      };

    case ACTION_TYPES.setIsPlaying: {
      const isPlaying = typeof action.isPlaying === "undefined" ? !state.isPlaying : action.isPlaying;
      return {
        ...state,
        isPlaying: state.currentSong ? isPlaying : false,
      };
    }

    case ACTION_TYPES.previousSong: {
      if (state.currentTime > 3) {
        // Replay current song
        return {
          ...state,
          currentTime: 0,
        };
      }

      const previousSong = state.playHistory[state.playHistory.length - 1];
      if (previousSong) {
        let playlist = state.playlist;
        let queue = copyArray(state.queue);
        if (state.currentSong) {
          queue.unshift(state.currentSong);
          if (queue.length > MAX_QUEUE_SIZE) {
            ({ playlist, queue } = removeFromQueueByIndex(playlist, queue, queue.length - 1));
          }
        }
        const currentSong = { ...previousSong };
        const playHistory = state.playHistory.slice(0, state.playHistory.length - 1);

        return {
          ...state,
          playHistory,
          currentSong,
          ...refillQueue(state.playlist, queue, currentSong, state.shuffle, state.repeat),
        };
      } else if (state.currentSong) {
        let playlist = state.playlist;
        let queue = copyArray(state.playHistory);
        queue.unshift(state.currentSong);
        if (queue.length > MAX_QUEUE_SIZE) {
          ({ playlist, queue } = removeFromQueueByIndex(playlist, queue, queue.length - 1));
        }
        const currentSong = null;

        return {
          ...state,
          isPlaying: false,
          queue,
          currentSong,
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.nextSong: {
      const nextSong = state.queue[0];
      if (nextSong) {
        const playHistory = copyArray(state.playHistory);
        if (state.currentSong) playHistory.push(state.currentSong);
        const currentSong = { ...nextSong };
        const queue = copyArray(state.queue).slice(1);

        return {
          ...state,
          playHistory,
          currentSong,
          ...refillQueue(state.playlist, queue, currentSong, state.shuffle, state.repeat),
        };
      } else if (state.currentSong) {
        const playHistory = copyArray(state.playHistory);
        playHistory.push(state.currentSong);
        const currentSong = null;

        return {
          ...state,
          isPlaying: false,
          playHistory,
          currentSong,
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.requestPlaylist:
      return {
        ...state,
        playlist: {
          isFetching: state.playlist.isFetching + 1,
          round: state.playlist.round,
          items: state.playlist.items,
        },
      };

    case ACTION_TYPES.doneRequestingPlaylist:
      return {
        ...state,
        playlist: {
          isFetching: state.playlist.isFetching - 1,
          round: state.playlist.round,
          items: state.playlist.items,
        },
      };

    case ACTION_TYPES.addToPlaylist: {
      const playlistItems = copyArray(state.playlist.items);

      // Insert at first index for which there is no element
      let index = action.index || playlistItems.length;
      while (playlistItems[index]) index++;
      playlistItems[index] = { ...action.item, playCount: state.playlist.round };
      const playlist = {
        ...state.playlist,
        items: playlistItems,
      };
      const refilled = refillQueue(playlist, state.queue, state.currentSong, state.shuffle, state.repeat);

      return {
        ...state,
        ...refilled,
      };
    }

    case ACTION_TYPES.removeFromPlaylist: {
      const newPlaylistItems = copyArray(state.playlist.items);
      const removedItem = newPlaylistItems.splice(action.index, 1)[0];
      const playHistory = state.playHistory.filter(item => item.id !== removedItem.id);

      const playCounts = newPlaylistItems.map(item => item.playCount);
      const playCountsWithLower = playCounts.concat(Math.max(...playCounts) - 1);
      const round = Math.min(...playCountsWithLower);

      const playlist = {
        isFetching: state.playlist.isFetching,
        round,
        items: newPlaylistItems,
      };
      const currentSong = currentSong && currentSong.id !== removedItem.id && currentSong;

      if (state.currentSong) {
        const modifiedQueue = removeFromQueueById(state.queue, removedItem.id);
        if (state.currentSong.id === removedItem.id) {
          const nextSong = modifiedQueue[0];
          if (nextSong) {
            const queue = copyArray(modifiedQueue).slice(1);
            const refilledQueue = refillQueue(playlist, queue, nextSong, state.shuffle, state.repeat);
            return {
              ...state,
              playHistory,
              ...refilledQueue,
            };
          } else {
            return {
              ...state,
              playlist,
              playHistory,
              queue: [],
              isPlaying: false,
              currentSong: null,
            };
          }
        } else {
          const refilledQueue = refillQueue(playlist, modifiedQueue, state.currentSong, state.shuffle, state.repeat);
          return {
            ...state,
            playHistory,
            ...refilledQueue,
          };
        }
      } else {
        // Nothing playing, so assume queue is empty
        return {
          ...state,
          playHistory,
          playlist,
        };
      }
    }

    case ACTION_TYPES.updatePlaylist: {
      const playlist = {
        round: state.playlist.round,
        items: action.items,
      };
      const refilled = refillQueue(playlist, state.queue, state.currentSong, state.shuffle, state.repeat);

      return {
        ...state,
        ...refilled,
      };
    }

    case ACTION_TYPES.mergeState:
      return {
        ...state,
        ...action.newState,
      };

    default:
      return state;
  }
};

export default reducer;
