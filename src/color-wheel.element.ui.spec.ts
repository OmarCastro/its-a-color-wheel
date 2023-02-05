import { test, expect } from '../test-utils/ui-tests.ts'

test('base test visual testing', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
  
  const colorWheel = page.locator('.test--base .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-default.png');
});


test('lightness visual testing', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheel = page.locator('.test--lightness .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-lightness-50.png');
  await colorWheel.evaluate(node => node.setAttribute("lightness", "75"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-lightness-75.png');
});

test('value visual testing', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheel = page.locator('.test--value .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-50.png');
  await colorWheel.evaluate(node => node.setAttribute("value", "75"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-75.png');
  await colorWheel.evaluate(node => node.setAttribute("value", "100"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-100.png');

});


test('dragging pointer should', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheel = page.locator('.test--base .test__view color-wheel');
  const slider = colorWheel.getByRole("slider")
  const sliderBoundingBox = await slider.boundingBox();
  const colorWheelBoundingBox = await colorWheel.boundingBox();
  test.fail(!sliderBoundingBox || !colorWheelBoundingBox, "bounding box is null")
  if(!sliderBoundingBox || !colorWheelBoundingBox){
    throw new Error("Should have failed already") 
    //also, the if condition stops TS complaining that boundingBox is possibly null 
  }
  const sliderCenterPoint = {
    x: sliderBoundingBox.x + sliderBoundingBox.width  / 2,
    y: sliderBoundingBox.y + sliderBoundingBox.height / 2
  }
  await page.mouse.move(sliderCenterPoint.x, sliderCenterPoint.y)
  await page.mouse.down()
  await page.mouse.move(sliderCenterPoint.x, colorWheelBoundingBox.y)
  await page.mouse.up()
  expect(await colorWheel.evaluate(node => node.getAttribute("saturation"))).toEqual("100");
});