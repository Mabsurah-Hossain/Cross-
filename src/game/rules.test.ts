import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isPavement,
  getRoadNumber,
  calculateStepScore,
  calculateRoadCrossBonus,
  calculateCarSpeed,
  checkCollision,
} from './rules';

test('isPavement detects starting pavement and every 5th row correctly', () => {
  // Row 0 is start pavement
  assert.equal(isPavement(0), true);
  // Rows 1..4 are road lanes
  assert.equal(isPavement(1), false);
  assert.equal(isPavement(2), false);
  assert.equal(isPavement(3), false);
  assert.equal(isPavement(4), false);
  // Row 5 is pavement (completed road 1)
  assert.equal(isPavement(5), true);
  // Rows 6..9 are road 2 lanes
  assert.equal(isPavement(6), false);
  assert.equal(isPavement(9), false);
  // Row 10 is pavement (completed road 2)
  assert.equal(isPavement(10), true);
  // Row 15 is pavement (completed road 3)
  assert.equal(isPavement(15), true);
});

test('calculateStepScore awards points only for forward progress', () => {
  // Start at row 0, move to row 1: +1 point, newMax = 1
  let result = calculateStepScore(1, 0);
  assert.equal(result.points, 1);
  assert.equal(result.newMaxRow, 1);

  // Move back to row 0: 0 points, newMax still 1
  result = calculateStepScore(0, 1);
  assert.equal(result.points, 0);
  assert.equal(result.newMaxRow, 1);

  // Move forward to row 1 again: 0 points, newMax still 1
  result = calculateStepScore(1, 1);
  assert.equal(result.points, 0);
  assert.equal(result.newMaxRow, 1);

  // Move forward to row 2: +1 point, newMax = 2
  result = calculateStepScore(2, 1);
  assert.equal(result.points, 1);
  assert.equal(result.newMaxRow, 2);

  // Big jump forward from row 2 to row 4: +2 points, newMax = 4
  result = calculateStepScore(4, 2);
  assert.equal(result.points, 2);
  assert.equal(result.newMaxRow, 4);
});

test('calculateRoadCrossBonus awards 10 points when reaching a new pavement', () => {
  // Moving across rows 1..4 gives no road bonus
  assert.equal(calculateRoadCrossBonus(1, 0).bonus, 0);
  assert.equal(calculateRoadCrossBonus(4, 0).bonus, 0);

  // Reaching pavement at row 5 crosses Road 1 -> awards 10 points!
  const bonus1 = calculateRoadCrossBonus(5, 0);
  assert.equal(bonus1.bonus, 10);
  assert.equal(bonus1.newHighestRoad, 1);
  assert.equal(bonus1.isCrossed, true);

  // Moving around on row 5 again does NOT re-award bonus
  const repeatRow5 = calculateRoadCrossBonus(5, 1);
  assert.equal(repeatRow5.bonus, 0);
  assert.equal(repeatRow5.newHighestRoad, 1);
  assert.equal(repeatRow5.isCrossed, false);

  // Crossing Road 2 and reaching row 10 awards another 10 points!
  const bonus2 = calculateRoadCrossBonus(10, 1);
  assert.equal(bonus2.bonus, 10);
  assert.equal(bonus2.newHighestRoad, 2);
  assert.equal(bonus2.isCrossed, true);
});

test('calculateCarSpeed increases with row progress and scales by difficulty', () => {
  const easySpeedRow1 = calculateCarSpeed(1, 'easy');
  const easySpeedRow20 = calculateCarSpeed(20, 'easy');
  assert.ok(easySpeedRow20 > easySpeedRow1, 'Car speed should increase with distance');

  const hardSpeedRow1 = calculateCarSpeed(1, 'hard');
  assert.ok(hardSpeedRow1 > easySpeedRow1, 'Hard mode should start faster than easy mode');
});

test('checkCollision correctly detects overlapping hitboxes', () => {
  const player = { x: 100, y: 100, width: 40, height: 40 };
  const carDirectHit = { x: 105, y: 102, width: 70, height: 35 };
  const carFarAway = { x: 300, y: 100, width: 70, height: 35 };

  assert.equal(checkCollision(player, carDirectHit), true);
  assert.equal(checkCollision(player, carFarAway), false);
});
