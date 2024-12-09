import { Page } from '@playwright/test';
import { FlightsPageLocators } from '../pageobjects/FlightsPageLocators';

export class FlightsPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the home page
  async navigateToHomePage() {
    await this.page.goto('https://www.easemytrip.com/', { waitUntil: 'load' });
  }

  // Click the "Flights" menu option
  async clickFlightsOption() {
    await this.page.locator(FlightsPageLocators.flightsOption).click();
  }

  // Click the "From" input box
  async clickFromOption() {
    await this.page.locator(FlightsPageLocators.fromOption).click();
  }

  // Enter source city in the search box
  async enterSourceCity(cityName: string) {
    const searchBoxInput = this.page.locator(FlightsPageLocators.searchBoxInput);
    await searchBoxInput.fill(cityName);
    await this.page.waitForTimeout(1000); // Wait for suggestions to load
  }

  // Select the first suggestion from the "From" dropdown
  async selectFirstSourceSearchResult() {
    const firstResult = this.page.locator(FlightsPageLocators.firstSearchResult);
    await firstResult.waitFor({ state: 'visible', timeout: 5000 });
    await firstResult.click();
  }

  // Click the "To" input box
  async clickToOption() {
    await this.page.locator(FlightsPageLocators.toOption).click();
    await this.page.waitForTimeout(1000);
  }

  // Enter destination city in the search box
  async enterDestinationCity(cityName: string) {
    const toSearchBoxInput = this.page.locator(FlightsPageLocators.toSearchBoxInput);
    await toSearchBoxInput.fill(cityName);
    await this.page.waitForTimeout(1000);
  }

  // Select the first suggestion from the "To" dropdown
  async selectFirstDestinationSearchResult() {
    const firstResult = this.page.locator(FlightsPageLocators.firstDestSearchResult);
    await firstResult.waitFor({ state: 'visible', timeout: 5000 });
    await firstResult.click();
  }

  // Find the lowest fare date in December
  async findLowestFareDecemberDate() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    if (currentYear !== 2024 || currentMonth !== 11) {
      throw new Error('This function should only run in December 2024.');
    }

    const daysLeftInDecember = 31 - today.getDate();
    const decemberDates = await this.page.$$(FlightsPageLocators.decemberDates);

    let lowestFare = Infinity;
    let lowestFareDateNode;

    for (let i = 0; i < daysLeftInDecember; i++) {
      const dateNode = decemberDates[i];
      const fareSpan = await dateNode.$(FlightsPageLocators.fareSpan);

      if (!fareSpan) continue;

      const fareText = await fareSpan.textContent();
      if (!fareText) continue;

      const fare = parseInt(fareText.slice(1).replace(',', ''), 10);
      if (fare < lowestFare) {
        lowestFare = fare;
        lowestFareDateNode = dateNode;
      }
    }

    if (lowestFareDateNode) {
      console.log(`Lowest fare found: ₹${lowestFare}`);
      return lowestFareDateNode;
    } else {
      console.warn('No valid lowest fare date found.');
      return null;
    }
  }

  // Select the lowest fare date in December
  async selectLowestFareDecemberDate() {
    const lowestFareDate = await this.findLowestFareDecemberDate();
    if (lowestFareDate) await lowestFareDate.click();
  }

  // Click the search button
  async clickSearchButton() {
    await this.page.locator(FlightsPageLocators.searchButton).click();
  }

  // Click the "Book Now" button
  async clickBookNowButton() {
    await this.page.locator(FlightsPageLocators.bookNowButton).click();
  }

  // Close the login modal
  async closeLoginModal() {
    await this.page.locator(FlightsPageLocators.loginModalCloseButton).click();
  }

  // Get the adult fare
  async getAdultFare(): Promise<number> {
    const text = await this.page.locator(FlightsPageLocators.adultFare).textContent();
    return parseFloat(text?.replace(/[^\d.-]/g, '') || '0');
  }

  // Get total taxes
  async getTotalTaxes(): Promise<number> {
    const text = await this.page.locator(FlightsPageLocators.totalTaxes).textContent();
    return parseFloat(text?.replace(/[^\d.-]/g, '') || '0');
  }

  // Get medical refund policy
  async getMedicalRefundPolicy(): Promise<number> {
    const text = await this.page.locator(FlightsPageLocators.medicalRefundPolicy).textContent();
    return text?.includes('Free') ? 0 : parseFloat(text?.replace(/[^\d.-]/g, '') || '0');
  }

  // Get grand total before applying coupon
  async getGrandTotalBeforeCoupon(): Promise<number> {
    const text = await this.page.locator(FlightsPageLocators.grandTotal).textContent();
    return parseFloat(text?.replace(/[^\d.-]/g, '') || '0');
  }

  // Enter coupon code
  async enterCouponCode(couponCode: string) {
    await this.page.locator(FlightsPageLocators.couponCodeTextField).fill(couponCode);
  }

  // Apply the coupon code
  async applyCouponCode() {
    await this.page.locator(FlightsPageLocators.applyButton).click();
  }

  // Get invalid coupon message
  async getInvalidCouponMessage(): Promise<string> {
    const text = await this.page.locator(FlightsPageLocators.couponMessage).textContent();
    return text || '';
  }

  // Click valid coupon radio button
  async clickValidCouponRadioButton() {
    await this.page.locator(FlightsPageLocators.validCouponRadioButton).click();
  }

  // Get success message after applying valid coupon
  async getSuccessMessage(): Promise<string> {
    const text = await this.page.locator(FlightsPageLocators.couponMessage).textContent();
    return text || '';
  }
}
