import { ACTION_TYPES, INITIAL_STATE, REPEAT_STATE } from "./constants";

// Queue utilities
const MAX_QUEUE_SIZE = 20;
const copyArray = arr => arr.map(item => ({ ...item }));
const shuffleArray = (arr) => {
  // Assumes array contains objects
  const newArr = copyArray(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
const buildQueueItems = (playlist, numQueueItems, currentSong, shuffle, repeat) => {
  switch (repeat) {
    case REPEAT_STATE.one:
      return {
        playlist: {
          isFetching: playlist.isFetching,
          round: 0,
          items: playlist.items.map(item => ({ ...item, playCount: 0 })),
        },
        queue: Array(numQueueItems).fill(currentSong),
      };

    case REPEAT_STATE.all: {
      let result = {
        playlist: {
          ...playlist,
          round: playlist.round - 1,
        },
        queue: [],
      };

      // Continue filling queue until reaches max
      while (result.queue.length < numQueueItems) {
        result.playlist.round++;
        const playlistItems  = shuffle ? shuffleArray(result.playlist.items) : copyArray(result.playlist.items);
        result = playlistItems.reduce((memo, item, index) => {
          // Only select item if it has not been played this round
          // And queue has space
          if (item.playCount <= memo.playlist.round && memo.queue.length < 20) {
            const newItem = {
              ...item,
              playCount: item.playCount + 1,
            };
            const newItems = memo.playlist.items.slice();
            newItems[index] = newItem;
            return {
              playlist: {
                ...memo.playlist,
                items: newItems,
              },
              queue: memo.queue.concat(newItem),
            };
          } else {
            const newItems = memo.playlist.items.slice();
            newItems[index] = item;
            return {
              ...memo,
              playlist: {
                ...memo.playlist,
                items: newItems,
              },
            };
          }
        }, result);
      }
      return result;
    }

    case REPEAT_STATE.off:
    default: {
      const playlistItems  = shuffle ? shuffleArray(playlist.items) : copyArray(playlist.items);
      return playlistItems.reduce((memo, item) => {
        // Only select item if it has not been played this round
        // And queue has space
        if (item.playCount <= memo.playlist.round && memo.queue.length < numQueueItems) {
          const newItem = {
            ...item,
            playCount: item.playCount + 1,
          };
          return {
            playlist: {
              ...memo.playlist,
              items: memo.playlist.items.concat(newItem),
            },
            queue: memo.queue.concat(newItem),
          };
        } else {
          return {
            ...memo,
            playlist: {
              ...memo.playlist,
              items: memo.playlist.items.concat(item),
            },
          };
        }
      }, {
        playlist: {
          isFetching: playlist.isFetching,
          round: playlist.round,
          items: [],
        },
        queue: [],
      });
    }
  }
};
const createQueue = (playlist, currentSong, shuffle, repeat) => {
  return buildQueueItems(playlist, MAX_QUEUE_SIZE, currentSong, shuffle, repeat);
};
const refillQueue = (playlist, queue, currentSong, shuffle, repeat) => {
  const result = buildQueueItems(playlist, MAX_QUEUE_SIZE - queue.length, currentSong, shuffle, repeat);
  return {
    playlist: result.playlist,
    queue: queue.concat(result.queue),
  };
};

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
        ...createQueue(state.playlist, state.currentSong, state.shuffle, repeat),
      };
    }

    case ACTION_TYPES.toggleShuffle:
      return {
        ...state,
        shuffle: !state.shuffle,
        ...createQueue(state.playlist, state.currentSong, state.shuffle, state.repeat),
      };

    case ACTION_TYPES.setIsPlaying:
      return {
        ...state,
        isPlaying: typeof action.isPlaying === "undefined" ? !state.isPlaying : action.isPlaying,
      };

    case ACTION_TYPES.previousSong: {
      const previousSong = state.playHistory[state.playHistory.length - 1];
      if (previousSong) {
        const queue = copyArray(state.queue);
        if (state.currentSong) {
          queue.unshift(state.currentSong);
          if (queue.length > MAX_QUEUE_SIZE) queue.pop();
        }
        const currentSong = { ...previousSong };
        const playHistory = state.playHistory.slice(0, state.playHistory.length - 1);

        return {
          ...state,
          playHistory,
          currentSong,
          ...refillQueue(state.playlist, queue, currentSong, state.shuffle, state.repeat),
        };
      } else {
        console.log("fail, no previous song");
        return state;
      }
    }

    case ACTION_TYPES.nextSong: {
      const nextSong = state.queue[0];
      if (nextSong) {
        const playHistory = copyArray(state.playHistory);
        if (state.currentSong) playHistory.push(state.currentSong);
        const currentSong = { ...nextSong };
        const queue = state.queue.slice(1);

        return {
          ...state,
          playHistory,
          currentSong,
          ...refillQueue(state.playlist, queue, currentSong, state.shuffle, state.repeat),
        };
      } else {
        console.log("fail, no next song");
        return state;
      }
    }

    case ACTION_TYPES.removeItemFromPlaylist: {
      // Deep copy
      const items = copyArray(state.playlist.items);
      const removed = items.splice(action.index, 1)[0];
      const queue = state.queue.filter(item => item.id === removed.id);
      const refilled = refillQueue(items, queue, state.currentSong, state.shuffle, state.repeat);

      return {
        ...state,
        ...refilled,
      };
    }

    case ACTION_TYPES.requestPlaylist:
      return {
        ...state,
        playlist: {
          isFetching: true,
          round: state.playlist.round,
          items: state.playlist.items,
        },
      };

    case ACTION_TYPES.updatePlaylist: {
      const playlist = {
        isFetching: false,
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
