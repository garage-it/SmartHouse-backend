export default function uniqueQueue(equals = referenceEquals) {
    let queue = [];

    const self = {
        get isEmpty() {
            return queue.length === 0;
        },
        enqueue,
        dequeue,
        remove,
        clear
    };

    return self;

    function enqueue(value) {
        if (!contains(value)) {
            queue.push(value);
        }
    }

    function contains(value) {
        return queue.find((v) => equals(v, value));
    }

    function dequeue() {
        return queue.shift();
    }

    function remove(value) {
        queue = queue.filter(v => !equals(v, value));
    }

    function clear() {
        queue = [];
    }
}

function referenceEquals(a, b) {
    return a === b;
}