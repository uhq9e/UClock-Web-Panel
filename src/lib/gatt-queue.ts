const gattQueue: (() => Promise<void>)[] = [];
let isProcessing = false;

function enqueue(task: () => Promise<void>) {
  return new Promise((resolve, reject) => {
    gattQueue.push(() => task().then(resolve).catch(reject));

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
