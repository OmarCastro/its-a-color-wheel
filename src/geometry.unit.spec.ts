// @ts-ignore
import { test } from '../test-utils/unit/test.ts';
// @ts-ignore
import { CircleInfo, calculateDistanceBetween2Points } from './geometry.ts';


test('CircleInfo.fromRectWithPercentInnerRadius', ({assert}) => {
  const rect = {x: 100, y:100, width: 100, height: 100}
  const innerRadius = 50
  assert({
    given: "A 100x100+100+100 rectangle with 50% inner radius",
    should: "return a 25-50r+150+150 circle",
    actual: CircleInfo.fromRectWithPercentInnerRadius(rect, innerRadius),
    expected: {
      radius: 50,
      center: {x: 150, y:150},
      innerRadius: 25,
      innerRadiusPerc: 50
    }
  })
});


test('CircleInfo.fromRectWithInnerRadius', ({assert}) => {
  assert({
    given: "A 100x100+100+100 rectangle with 25 units of inner radius",
    should: "return a 25-50r+150+150 circle, with innerRadius on 50%",
    actual: CircleInfo.fromRectWithInnerRadius({x: 100, y:100, width: 100, height: 100}, 25),
    expected: {
      radius: 50,
      center: {x: 150, y:150},
      innerRadius: 25,
      innerRadiusPerc: 50
    }
  })
});

test('calculateDistanceBetween2Points', ({assert}) => {
  const point0 = {x: 0, y:0}
  const point1 = {x: 300, y:400}

  assert({
    given: "A +0+0 and +300+400 point",
    should: "return a distance 500 units",
    actual: calculateDistanceBetween2Points(point0, point1),
    expected: 500
  })
});