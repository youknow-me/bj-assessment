// utils.js
// Generate Fibonacci sequence up to n terms

const getFibonacci = (n) => {
    if (typeof n !== 'number' || n <= 0) return [];
    if (n === 1) return [0];
    const series = [0, 1];
    for (let i = 2; i < n; i++) {
        series.push(series[i - 1] + series[i - 2]);
    }
    return series;
};

// Check if a number is prime
const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

// Calculate GCD (HCF) of two numbers
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

// Calculate LCM of two numbers
const lcm = (a, b) => {
    if (a === 0 || b === 0) return 0;
    return Math.abs(a * b) / gcd(a, b);
};

// Calculate LCM of an array
const getLCM = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr.reduce((acc, curr) => lcm(acc, curr));
};

// Calculate HCF of an array
const getHCF = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr.reduce((acc, curr) => gcd(acc, curr));
};

module.exports = { getFibonacci, isPrime, getLCM, getHCF };