/**
 * Debounce utility - delays function execution until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} wait - Milliseconds to delay
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle utility - limits function execution to once per wait milliseconds
 * @param {Function} func - The function to throttle
 * @param {number} wait - Minimum milliseconds between executions
 * @returns {Function} - Throttled function
 */
export function throttle(func, wait = 300) {
    let lastTime = 0;
    return function executedFunction(...args) {
        const now = Date.now();
        if (now - lastTime >= wait) {
            lastTime = now;
            func(...args);
        }
    };
}
