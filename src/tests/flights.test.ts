import { test, expect } from '@playwright/test';
import { FlightsPage } from '../pages/FlightsPage';
import { FlightsPageLocators } from '../pageobjects/FlightsPageLocators';

test.describe('EaseMyTrip Flights Booking', () => {
  test('Testing the ticket booking flow', async ({ page }) => {
    const flightsPage = new FlightsPage(page);

    const sourceCity = 'Lucknow';
    const destinationCity = 'Mumbai';
    const invalidPromoCode = 'abc123';

    await flightsPage.navigateToHomePage();
    await flightsPage.clickFlightsOption();
    await page.locator(FlightsPageLocators.fromOption).waitFor({ state: 'visible' });

    // Enter source city
    await flightsPage.clickFromOption();
    const sourceSearchBox = page.locator(FlightsPageLocators.searchBoxInput);
    for (const letter of sourceCity) {
      await sourceSearchBox.press(letter);
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(1000);
    await flightsPage.selectFirstSourceSearchResult();

    // Enter destination city
    const destinationSearchBox = page.locator(FlightsPageLocators.toSearchBoxInput);
    for (const letter of destinationCity) {
      await destinationSearchBox.press(letter);
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(2000);
    await flightsPage.selectFirstDestinationSearchResult();

    await page.waitForTimeout(2000);
    await flightsPage.selectLowestFareDecemberDate();
    await flightsPage.clickSearchButton();
    await page.waitForTimeout(4000);

    await flightsPage.clickBookNowButton();
    await page.waitForTimeout(4000);
    await flightsPage.closeLoginModal();

    // Verify price summary
    const adultFare = await flightsPage.getAdultFare();
    const totalTaxes = await flightsPage.getTotalTaxes();
    const medicalRefundPolicy = await flightsPage.getMedicalRefundPolicy();
    const grandTotalBefore = await flightsPage.getGrandTotalBeforeCoupon();
    const expectedTotal = adultFare + totalTaxes + medicalRefundPolicy;

    console.log(`Adult Fare: ₹${adultFare}, Total Taxes: ₹${totalTaxes}, Medical Refund Policy: ₹${medicalRefundPolicy}, Grand Total: ₹${grandTotalBefore}`);
    expect(expectedTotal).toBeCloseTo(grandTotalBefore, 2);

    // Test invalid coupon code
    await flightsPage.enterCouponCode(invalidPromoCode);
    await flightsPage.applyCouponCode();
    await page.waitForTimeout(4000);
    const invalidCouponMessage = await flightsPage.getInvalidCouponMessage();
    console.log(`Coupon Message: ${invalidCouponMessage}`);
    expect(invalidCouponMessage).toContain('Invalid Coupon');

    // Test valid coupon code
    await flightsPage.clickValidCouponRadioButton();
    await page.waitForTimeout(2000);
    const successMessage = await flightsPage.getSuccessMessage();
    console.log(`Success Message: ${successMessage}`);
    expect(successMessage).toContain('Congratulations! Instant Discount of Rs.400 has been applied successfully.');
  });
});
