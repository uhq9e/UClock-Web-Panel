type Queueable = () => Promise<unknown> | unknown;

const gattQueue: Queueable[] = [];
let isProcessing = false;

function enqueue(task: Queueable) {
  return new Promise((resolve, reject) => {
    gattQueue.push(() =>
      (async () => await task())().then(resolve).catch(reject)
    );

    if (!isProcessing) {
      processQueue();
    }
  });
}

async function processQueue() {
  if (isProcessing || gattQueue.length === 0) return;
  isProcessing = true;
  while (gattQueue.length > 0) {
    const task = gattQueue.shift();
    try {
      await task?.();
    } catch (error) {
      console.error("Task failed:", error);
    }
  }
  isProcessing = false;
}

export { enqueue };
