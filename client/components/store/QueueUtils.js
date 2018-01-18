import { MAX_QUEUE_SIZE, REPEAT_STATE } from "./constants";

export const copyArray = arr => arr.map(item => ({ ...item }));

const shuffleArray = (arr) => {
  const newArr = copyArray(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const createQueueItem = item => ({
  ...item,
  uniqueId: `${item.id}_${Math.random().toString(36).substr(2, 9)}`,
});
const playlistToQueue = (playlist, shuffle) => {
  const newPlaylist = shuffle ? shuffleArray(playlist) : copyArray(playlist);
  return newPlaylist.map(createQueueItem);
};

export const generateQueue = (playlist, shuffle, repeat, currentSong) => {
  if (repeat === REPEAT_STATE.one) return Array(MAX_QUEUE_SIZE).fill(currentSong || playlist[0]).map(createQueueItem);

  let queue = playlistToQueue(playlist, shuffle);
  while (repeat === REPEAT_STATE.all && queue.length < MAX_QUEUE_SIZE) {
    queue = queue.concat(playlistToQueue(playlist, shuffle));
  }
  return queue;
};
export const refillQueue = (queue, playlist, shuffle, repeat) => {
  if (repeat === REPEAT_STATE.one) return Array(MAX_QUEUE_SIZE).fill(queue[0]).map(createQueueItem);

  let newQueue = copyArray(queue);
  while (repeat === REPEAT_STATE.all && newQueue.length < MAX_QUEUE_SIZE) {
    newQueue = newQueue.concat(playlistToQueue(playlist, shuffle));
  }
  return newQueue;
};
export const addToQueueAtIndex = (queue, item, index) => {
  const newQueue = copyArray(queue);
  newQueue.splice(index, 0, createQueueItem(item));
  return newQueue;
};

export const removeFromQueueById = (queue, id) => copyArray(queue).filter(o => o.id !== id);
export const removeFromQueueByIndex = (queue, index) => copyArray(queue).filter((o, i) => i !== index);
