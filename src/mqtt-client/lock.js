export default function lock() {
    let isLocked = false;

    return {
        get isLocked() {
            return isLocked;
        },
        lock,
        unlock
    };

    function lock() {
        isLocked = true;
    }

    function unlock() {
        isLocked = false;
    }
}