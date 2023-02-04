import { test, expect } from '../test-utils/ui-tests.ts'

test('base test', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
  
  const colorWheel = page.locator('.test--base .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-default.png');
});


test('lightness', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheel = page.locator('.test--lightness .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-lightness-50.png');
  await colorWheel.evaluate(node => node.setAttribute("lightness", "75"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-lightness-75.png');
});

test('value', async ({ page }) => {
  await page.goto('./build/docs/test-page.html');
    
  const colorWheel = page.locator('.test--value .test__view color-wheel')

  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-50.png');
  await colorWheel.evaluate(node => node.setAttribute("value", "75"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-75.png');
  await colorWheel.evaluate(node => node.setAttribute("value", "100"))
  await expect.soft(await colorWheel.screenshot()).toMatchSnapshot('color-wheel-value-100.png');

});