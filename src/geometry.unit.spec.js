import { test } from '../test-utils/unit/test.ts'
import { CircleInfo, calculateDistanceBetween2Points } from './geometry.js'

test('CircleInfo.fromRectWithPercentInnerRadius', async ({ step, expect }) => {
  await step('Given a 100x100+100+100 rectangle and 50% inner radius, should return a 25-50r+150+150 circle', async () => {
    const givenRect = { x: 100, y: 100, width: 100, height: 100 }
    const givenInnerRadius = 50
    await expect(CircleInfo.fromRectWithPercentInnerRadius(givenRect, givenInnerRadius)).toEqual({
      radius: 50,
      center: { x: 150, y: 150 },
      innerRadius: 25,
      innerRadiusPerc: 50
    })
  })
})

test('CircleInfo.fromRectWithInnerRadius', async ({ step, expect }) => {
  await step('Given a 100x100+100+100 rectangle and 25 units of inner radius, should return a 25-50r+150+150 circle, with innerRadius on 50%', async () => {
    const givenRect = { x: 100, y: 100, width: 100, height: 100 }
    const givenRadius = 25
    await expect(CircleInfo.fromRectWithInnerRadius(givenRect, givenRadius)).toEqual({
      radius: 50,
      center: { x: 150, y: 150 },
      innerRadius: 25,
      innerRadiusPerc: 50
    })
  })
})

test('calculateDistanceBetween2Points', async ({ step, expect }) => {
  await step('Given +0+0 and +300+400 points, should return a distance 500 units', async () => {
    const point0 = { x: 0, y: 0 }
    const point1 = { x: 300, y: 400 }
    await expect(calculateDistanceBetween2Points(point0, point1)).toEqual(500)
  })
})
