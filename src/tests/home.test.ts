import { test, expect } from '@playwright/test';
import { LoginModalPage } from '../pages/LoginModalPage';

test.describe('MakeMyTrip Lowest Fare Date Selection', () => {
  test('Select the lowest fare date for December 2024', async ({ page }) => {
    // Navigate to MakeMyTrip
    await page.goto('https://www.makemytrip.com/');
    
    // Initialize the LoginModalPage (if applicable)
    const loginModal = new LoginModalPage(page);
    expect(await loginModal.isModalVisible()).toBe(true);
    await loginModal.closeModal();

    // Navigate to the flights section
    await page.locator('li[data-cy="menu_Flights"]').click();
    await page.waitForSelector('input[data-cy="fromCity"]');

    /// Enter source and destination cities (as you did in the original code)
    await page.locator('input[data-cy="fromCity"]').click();
    await page.locator('input[placeholder="From"]').fill('Lucknow');
    await page.waitForTimeout(2000);
    await page.locator('li[role="option"]').first().click();
    await page.waitForTimeout(2000);

    await page.locator('input[data-cy="toCity"]').click();
    await page.locator('input[placeholder="To"]').fill('Mumbai');
    await page.waitForTimeout(2000);
    await page.locator('li[role="option"]').first().click();
    await page.waitForTimeout(2000);


    // Open the departure date picker
    const departureInput = page.locator('div.flt_fsw_inputBox.dates input#departure');
    await page.waitForSelector('.DayPicker-Months');

    // Extract all days in December with their prices
    const prices = await page.evaluate(() => {
      const monthDivs = document.querySelectorAll('.DayPicker-Month');
      const decemberDiv = Array.from(monthDivs).find(div => 
        div.querySelector('.DayPicker-Caption')?.textContent?.includes('December 2024')
      );

      if (!decemberDiv) return null;

      const days = decemberDiv.querySelectorAll('.DayPicker-Day');
      const result: { date: string; price: number | null }[] = [];

      days.forEach(day => {
        const dateLabel = day.getAttribute('aria-label'); // e.g., "Tue Dec 17 2024"
        const priceElement = day.querySelector('.todayPrice');
        const priceText = priceElement?.textContent?.replace(/,/g, '').trim();

        if (dateLabel && priceText) {
          const price = parseFloat(priceText) || null;
          result.push({ date: dateLabel, price });
        }
      });

      return result;
    });

    if (!prices) {
      console.error('December 2024 calendar not found.');
    } else {
      // Filter out null prices and find the lowest one
      const validPrices = prices.filter(p => p.price !== null) as { date: string; price: number }[];
      const lowestPriceDay = validPrices.reduce((min, curr) => (curr.price < min.price ? curr : min), validPrices[0]);

      console.log(`Lowest fare in December 2024: ₹${lowestPriceDay.price} on ${lowestPriceDay.date}`);

      // Step 7: Click the date with the lowest fare
      const lowestFareDateElement = page.locator(`div[aria-label="${lowestPriceDay.date}"]`);
      await lowestFareDateElement.click();
    }

    // Locate the search button using XPath and click it
    const searchButton = page.locator('xpath=/html/body/div[1]/div/div[2]/div/div/div/div/div[2]/p/a');
    await searchButton.click();

    // Handle page load error
    let attempts = 0;
    const maxAttempts = 5;
    let pageLoadedSuccessfully = false;

    while (attempts < maxAttempts && !pageLoadedSuccessfully) {
      try {
        // Wait for the page to load and check if an error message appears
        await page.waitForLoadState('networkidle'); // Wait for the page to finish loading
        const errorMessage = page.locator('text=Oops! There was a problem loading the page');
        const isErrorVisible = await errorMessage.isVisible();

        if (isErrorVisible) {
          console.log('Error detected, refreshing the page...');
          await page.reload(); // Refresh the page
          attempts++;
        } else {
          // If no error is visible, assume the page has loaded successfully
          pageLoadedSuccessfully = true;
        }
      } catch (error) {
        console.error('Error while loading page: ', error);
        break; // Stop if an error occurs during the load state check
      }
    }

    // Ensure the page loaded correctly or handle failure
    if (!pageLoadedSuccessfully) {
      throw new Error('Page failed to load correctly after multiple attempts');
    }

    // Proceed with the next steps after successful page load
    console.log('Page loaded successfully');
  });
});
