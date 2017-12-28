import { ACTION_TYPES, INITIAL_STATE, REPEAT_STATE } from "./constants";
import {
  copyArray,
  generateQueue,
  refillQueue,
  removeFromQueueByIndex,
  removeFromQueueById
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
      const repeat = state.repeat === REPEAT_STATE.off
      ? REPEAT_STATE.all
      : (state.repeat === REPEAT_STATE.all ? REPEAT_STATE.one : REPEAT_STATE.off);
      return {
        ...state,
        repeat,
        queue: generateQueue(state.playlist, state.shuffle, repeat),
      };
    }

    case ACTION_TYPES.toggleShuffle:
      return {
        ...state,
        shuffle: !state.shuffle,
        queue: generateQueue(state.playlist, !state.shuffle, state.repeat),
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
        const queue = [{ ...state.currentSong }].concat(copyArray(state.queue));
        const playHistory = copyArray(state.playHistory).slice(0, state.playHistory.length - 1);
        return {
          ...state,
          playHistory,
          queue,
          currentSong: { ...previousSong },
        };
      } else if (state.currentSong) {
        const queue = [{ ...state.currentSong }].concat(copyArray(state.queue));
        return {
          ...state,
          isPlaying: false,
          queue,
          currentSong: null,
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.nextSong: {
      const nextSong = state.queue[0];
      if (nextSong) {
        const playHistory = copyArray(state.queue).concat({ ...state.currentSong });
        const modifiedQueue = removeFromQueueByIndex(state.queue, 0);
        const newQueue = refillQueue(modifiedQueue, state.playlist, state.shuffle, state.repeat);
        return {
          ...state,
          playHistory,
          queue: newQueue,
          currentSong: { ...nextSong },
        };
      } else if (state.currentSong) {
        const playHistory = copyArray(state.queue).concat({ ...state.currentSong });
        return {
          ...state,
          isPlaying: false,
          playHistory,
          currentSong: null,
        };
      } else {
        return state;
      }
    }

    case ACTION_TYPES.removeFromSearchResults: {
      const results = state.searchResults.results.slice();
      results.splice(action.index, 1);
      return {
        ...state,
        searchResults: {
          isFetching: state.searchResults.isFetching,
          results,
        },
      };
    }

    case ACTION_TYPES.removeFromQueueByIndex: {
      const queue = removeFromQueueByIndex(state.queue, action.index);
      return {
        ...state,
        queue: refillQueue(queue, state.playlist, state.shuffle, state.repeat),
      };
    }

    case ACTION_TYPES.movePlaylistItem: {
      const playlistItems = copyArray(state.playlist.items);
      playlistItems.splice(action.dest, 0, playlistItems.splice(action.source, 1)[0]);
      return {
        ...state,
        playlist: {
          isFetching: state.playlist.isFetching,
          items: playlistItems,
        },
      };
    }

    case ACTION_TYPES.moveQueueItem: {
      const queue = copyArray(state.queue);
      queue.splice(action.dest, 0, queue.splice(action.source, 1)[0]);
      return {
        ...state,
        queue,
      };
    }

    case ACTION_TYPES.requestPlaylist:
      return {
        ...state,
        playlist: {
          isFetching: state.playlist.isFetching + 1,
          items: state.playlist.items,
        },
      };

    case ACTION_TYPES.doneRequestingPlaylist:
      return {
        ...state,
        playlist: {
          isFetching: state.playlist.isFetching - 1,
          items: state.playlist.items,
        },
      };

    case ACTION_TYPES.addToPlaylist: {
      // No duplicates in playlist
      if (state.playlist.items.map(item => item.id).includes(action.item.id)) return state;
      const playlistItems = copyArray(state.playlist.items);

      // Find first index for which no element exists
      let index = action.index || playlistItems.length;
      while (playlistItems[index]) index++;
      playlistItems[index] = action.item;
      const playlist = {
        isFetching: state.playlist.isFetching,
        items: playlistItems,
      };

      const queue = generateQueue(playlistItems, state.shuffle, state.repeat);

      if (state.currentSong) {
        return {
          ...state,
          playlist,
          queue,
        };
      } else {
        return {
          ...state,
          playlist,
          currentSong: queue[0],
          queue: removeFromQueueByIndex(queue, 0),
        };
      }
    }

    case ACTION_TYPES.removeFromPlaylistByIndex: {
      const playlistItems = copyArray(state.playlist.items);
      const removed = playlistItems.splice(action.index, 1)[0];
      const playlist = {
        isFetching: state.playlist.isFetching,
        items: playlistItems,
      };

      const queue = removeFromQueueById(state.queue, removed.id);
      if (state.currentSong && state.currentSong.id === removed.id) {
        return {
          ...state,
          playlist,
          currentSong: queue[0],
          queue: removeFromQueueByIndex(queue, 0),
        };
      } else {
        return {
          ...state,
          playlist,
          queue: refillQueue(queue, playlistItems, state.shuffle, state.repeat),
        };
      }
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
