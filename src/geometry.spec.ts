import { test, expect } from '@playwright/test';
import { CircleInfo, calculateDistanceBetween2Points } from './geometry';


test('correct values from rect and percentage inner radius', ({}) => {
  // arrange
  const rect = {x: 100, y:100, width: 100, height: 100}
  const radiusPercantage = 50
  
  //act
  const circle = CircleInfo.fromRectWithPercentInnerRadius(rect, radiusPercantage)

  // assert

  expect(circle.radius).toEqual(50)
  expect(circle.center).toEqual({x: 150, y:150})
  expect(circle.innerRadius).toEqual(25)
  expect(circle.innerRadiusPerc).toEqual(50)
});


test('correct values from rect and absolute inner radius', ({}) => {
  // arrange
  const rect = {x: 100, y:100, width: 100, height: 100}
  const radius = 25
  
  //act
  const circle = CircleInfo.fromRectWithInnerRadius(rect, radius)

  // assert

  expect(circle.radius).toEqual(50)
  expect(circle.center).toEqual({x: 150, y:150})
  expect(circle.innerRadius).toEqual(25)
  expect(circle.innerRadiusPerc).toEqual(50)
});

test('calculate distance between 2 points', ({}) => {
  // arrange
  const point0 = {x: 0, y:0}
  const point1 = {x: 300, y:400}
  
  //act
  const distance = calculateDistanceBetween2Points(point0, point1)

  // assert
  expect(distance).toEqual(500)
});