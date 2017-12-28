import { MAX_QUEUE_SIZE } from "./constants";

export const copyArray = arr => arr.map(item => ({ ...item }));

const shuffleArray = (arr) => {
  const newArr = copyArray(arr);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const playlistToQueue = (playlist, shuffle) => shuffle ? shuffleArray(playlist) : copyArray(playlist);
export const generateQueue = (playlist, shuffle, repeat) => {
  let queue = playlistToQueue(playlist, shuffle);
  while (repeat && queue.length < MAX_QUEUE_SIZE) {
    queue = queue.concat(playlistToQueue(playlist, shuffle));
  }
  return queue;
};
export const refillQueue = (queue, playlist, shuffle, repeat) => {
  let newQueue = copyArray(queue);
  while (repeat && newQueue.length < MAX_QUEUE_SIZE) {
    newQueue = newQueue.concat(playlistToQueue(playlist, shuffle));
  }
  return queue;
};

export const removeFromQueueById = (queue, id) => copyArray(queue).filter(o => o.id !== id);
export const removeFromQueueByIndex = (queue, index) => copyArray(queue).filter((o, i) => i !== index);
