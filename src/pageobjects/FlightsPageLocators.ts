export const FlightsPageLocators = {
  //Flights Page Locators 
  flightsOption: '//*[@id="homepagemenuUL"]/li[1]/a',
  fromOption: '//*[@id="FromSector_show"]',
  searchBoxInput: '//input[@id="a_FromSector_show"]',
  firstSearchResult: '//*[@id="fromautoFill"]/ul/li[1]',
  toOption: '//*[@id="Editbox13_show"]',
  toSearchBoxInput: '//input[@id="a_Editbox13_show"]',
  firstDestSearchResult: '#toautoFill > ul > li:first-child',
  decemberDates: '.days li:not(.old-dt)',
  fareSpan: 'span',
  searchButton: '//*[@id="divSearchFlight"]/button',
  bookNowButton: '//*[@id="ResultDiv"]/div/div/div[4]/div[2]/div[1]/div[1]/div[6]/button[1]',
  loginModalCloseButton: '//*[@id="lgnBox"]/div[1]/div[1]/div[2]',

  // Locators for the price summary
  adultFare: '//*[@id="divFareSummary"]/div[1]/div[2]',
  totalTaxes: '//*[@id="divFareSummary"]/div[2]/div[3]',
  medicalRefundPolicy: '//*[@id="divFareSummary"]/div[5]',
  grandTotal: '//*[@id="divFareSummary"]/div[7]',
  discount: '//*[@id="divFareSummary"]/div[4]/div[2]',

  // Coupon code locators
  couponCodeTextField: '//*[@id="txtCouponCode"]',
  applyButton: '//*[@id="divCouponCodeApply"]/div[2]/div',
  couponMessage: '//*[@id="easeFareDetails1_promodiv"]',
  validCouponRadioButton: '//*[@id="spnRdoBESTDEAL"]',
};
