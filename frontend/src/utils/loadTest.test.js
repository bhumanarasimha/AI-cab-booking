import { describe, test, expect } from 'vitest';

// Simulates the calculation algorithm used in load-test.js and PerformanceTest.jsx
function calculateStats(latencies) {
  const sorted = [...latencies].sort((a, b) => a - b);
  const count = sorted.length;
  if (count === 0) {
    return { min: 0, max: 0, avg: 0, p50: 0, p90: 0, p95: 0, p99: 0 };
  }
  const sum = sorted.reduce((a, b) => a + b, 0);
  return {
    min: sorted[0],
    max: sorted[count - 1],
    avg: Math.round(sum / count),
    p50: sorted[Math.floor(count * 0.5)],
    p90: sorted[Math.floor(count * 0.9)] || sorted[count - 1],
    p95: sorted[Math.floor(count * 0.95)] || sorted[count - 1],
    p99: sorted[Math.floor(count * 0.99)] || sorted[count - 1]
  };
}

// Simulates the latency distribution logic
function getSimulatedLatencyDistributionBounds(rand) {
  if (rand < 0.70) {
    return { min: 50, max: 250 };
  } else if (rand < 0.95) {
    return { min: 250, max: 600 };
  } else {
    return { min: 600, max: 1500 };
  }
}

describe('Load Test Statistics & Pacing Math', () => {
  test('should return zeroes when calculating statistics on empty list', () => {
    const stats = calculateStats([]);
    expect(stats.min).toBe(0);
    expect(stats.max).toBe(0);
    expect(stats.avg).toBe(0);
    expect(stats.p50).toBe(0);
    expect(stats.p90).toBe(0);
    expect(stats.p95).toBe(0);
    expect(stats.p99).toBe(0);
  });

  test('should compute simple average correctly', () => {
    const stats = calculateStats([100, 200, 300]);
    expect(stats.avg).toBe(200);
  });

  test('should round average values correctly', () => {
    const stats = calculateStats([100, 101, 102, 105]); // sum: 408 / 4 = 102
    expect(stats.avg).toBe(102);

    const statsFractional = calculateStats([10, 20, 20]); // sum: 50 / 3 = 16.666
    expect(statsFractional.avg).toBe(17);
  });

  test('should find the minimum and maximum correctly', () => {
    const stats = calculateStats([500, 10, 1200, 350]);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(1200);
  });

  test('should compute correct p50 (median) percentile', () => {
    // 5 elements sorted: [100, 200, 300, 400, 500]
    // index: Math.floor(5 * 0.5) = 2 -> 300
    const stats = calculateStats([300, 100, 500, 200, 400]);
    expect(stats.p50).toBe(300);
  });

  test('should compute correct p90 percentile', () => {
    // 10 elements: index: Math.floor(10 * 0.9) = 9 -> 1000
    const list = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
    const stats = calculateStats(list);
    expect(stats.p90).toBe(1000);
  });

  test('should compute correct p95 percentile', () => {
    // 20 elements: index: Math.floor(20 * 0.95) = 19 -> last element
    const list = Array.from({ length: 20 }, (_, i) => (i + 1) * 50); // 50 to 1000
    const stats = calculateStats(list);
    expect(stats.p95).toBe(1000);
  });

  test('should compute correct p99 percentile', () => {
    const list = Array.from({ length: 100 }, (_, i) => i + 1); // 1 to 100
    const stats = calculateStats(list);
    expect(stats.p99).toBe(100);
  });

  test('should determine correct bounds for low latency random simulation (rand < 0.7)', () => {
    const bounds = getSimulatedLatencyDistributionBounds(0.5);
    expect(bounds.min).toBe(50);
    expect(bounds.max).toBe(250);
  });

  test('should determine correct bounds for mid latency random simulation (0.7 <= rand < 0.95)', () => {
    const bounds = getSimulatedLatencyDistributionBounds(0.8);
    expect(bounds.min).toBe(250);
    expect(bounds.max).toBe(600);
  });

  test('should determine correct bounds for high latency random simulation (rand >= 0.95)', () => {
    const bounds = getSimulatedLatencyDistributionBounds(0.97);
    expect(bounds.min).toBe(600);
    expect(bounds.max).toBe(1500);
  });
});
