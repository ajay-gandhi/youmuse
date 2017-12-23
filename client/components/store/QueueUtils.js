import { REPEAT_STATE } from "./constants";

// Queue utilities
export const MAX_QUEUE_SIZE = 20;
export const copyArray = arr => arr.map(item => ({ ...item }));
const shuffleArray = (arr) => { // Assumes array contains objects
  const newArr = copyArray(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
const buildQueueItems = (playlist, numQueueItems, currentSong, shuffle, repeat) => {
  switch (repeat) {
    case REPEAT_STATE.one: {
      const repeatSong = currentSong || playlist.items.find(item => item.playCount <= playlist.round);
      return {
        playlist: {
          isFetching: playlist.isFetching,
          round: 0,
          items: playlist.items.map(item => ({ ...item, playCount: 0 })),
        },
        queue: Array(numQueueItems).fill(repeatSong),
        currentSong: repeatSong,
      };
    }

    case REPEAT_STATE.all: {
      let result = {
        playlist,
        queue: [],
        currentSong,
      };
      if (playlist.items.length === 0) return result;

      // Fill queue until reaches max
      while (result.queue.length < numQueueItems) {
        const playlistItems = (shuffle ? shuffleArray : copyArray)(result.playlist.items);
        result = playlistItems.reduce((memo, item, index) => {
          // Only select item if it has not been played this round
          // And queue has space
          if (item.playCount <= memo.playlist.round && memo.queue.length < 20) {
            const newItem = {
              ...item,
              playCount: item.playCount + 1,
            };
            const newItems = copyArray(memo.playlist.items);
            newItems[index] = newItem;
            if (memo.currentSong) {
              return {
                playlist: {
                  ...memo.playlist,
                  items: newItems,
                },
                queue: memo.queue.concat(newItem),
                currentSong: memo.currentSong,
              };
            } else {
              return {
                playlist: {
                  ...memo.playlist,
                  items: newItems,
                },
                queue: memo.queue,
                currentSong: newItem,
              };
            }
          } else {
            const newItems = copyArray(memo.playlist.items);
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
      const playlistItems = shuffle ? shuffleArray(playlist.items) : copyArray(playlist.items);
      return playlistItems.reduce((memo, item) => {
        // Only select item if it has not been played this round
        // And queue has space
        if (item.playCount <= memo.playlist.round && memo.queue.length < numQueueItems) {
          const newItem = {
            ...item,
            playCount: item.playCount + 1,
          };
          if (memo.currentSong) {
            return {
              playlist: {
                ...memo.playlist,
                items: memo.playlist.items.concat(newItem),
              },
              queue: memo.queue.concat(newItem),
              currentSong: memo.currentSong,
            };
          } else {
            return {
              playlist: {
                ...memo.playlist,
                items: memo.playlist.items.concat(newItem),
              },
              queue: memo.queue,
              currentSong: newItem,
            };
          }
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
        currentSong,
      });
    }
  }
};

// Builds a new queue, updating round and play counts as the queue is filled.
// If a currentQueue is given, resets the round and play counts according to
// items in currentQueue.
export const createQueue = (playlist, currentSong, shuffle, repeat, currentQueue = []) => {
  let round = playlist.round;
  const playlistItems = copyArray(playlist.items);
  if (currentQueue.length > 0) {
    // Undo currentQueue playCounts
    currentQueue.forEach((item) => {
      // Find corresponding item in playlistItems
      for (let i = 0; i < playlistItems.length; i++) {
        if (playlistItems[i].id === item.id) {
          return playlistItems[i].playCount--;
        }
      }
    });
    round = playlistItems.reduce((memo, item) => item.playCount < memo ? item.playCount : memo, Number.MAX_SAFE_INTEGER);
  }
  const newPlaylist = {
    isFetching: playlist.isFetching,
    round,
    items: playlistItems,
  };
  return buildQueueItems(newPlaylist, MAX_QUEUE_SIZE, currentSong, shuffle, repeat);
};

// Refills the given queue with the given playlist and options. Updates round
// and play counts in the playlist
export const refillQueue = (playlist, queue, currentSong, shuffle, repeat) => {
  const result = buildQueueItems(playlist, MAX_QUEUE_SIZE - queue.length, currentSong, shuffle, repeat);
  return {
    playlist: result.playlist,
    queue: queue.concat(result.queue),
    currentSong: result.currentSong,
  };
};

// Removes the item at the given index from the queue and updates round and
// play counts
export const removeFromQueueByIndex = (playlist, queue, index) => {
  let round = playlist.round;
  const playlistItems = copyArray(playlist.items);
  const newQueue = copyArray(queue);
  const removed = newQueue.splice(index, 1);

  // Find corresponding item in playlist, decrease playCount
  for (let i = 0; i < playlistItems.length; i++) {
    if (playlistItems[i].id === removed.id) {
      playlistItems[i].playCount--;
      if (playlistItems[i].playCount < round) round = playlistItems[i].playCount;
      break;
    }
  }
  return {
    playlist: {
      isFetching: playlist.isFetching,
      round,
      items: playlistItems,
    },
    newQueue,
  };
};

// Removes items with the given ID from the queue
export const removeFromQueueById = (queue, id) => copyArray(queue).filter(item => item.id !== id);
