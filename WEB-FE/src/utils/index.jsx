// export function formatCurrency(number) {
//   // Convert to string and split into integer and decimal parts
//   const [integerPart, decimalPart] = String(number).split(".");

//   // Format integer part with commas
//   const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

//   // Combine integer and decimal parts with a dot
//   const formattedNumber = decimalPart
//     ? `${formattedInteger}.${decimalPart}`
//     : formattedInteger;

//   return formattedNumber;
// }

export function formatCurrency(amount, currency = "USD", locale = "en-US") {
  // Format number to currency
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });

  return formatter.format(amount);
}

export function formatPrice(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function increaseBy40Percent(number) {
  return number * 1.4;
}
