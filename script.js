// Update currency symbols in input fields when currency changes
const currencySelect = document.getElementById('currency');
const currentCurrencySymbol = document.getElementById('currentCurrencySymbol');
const annualCurrencySymbol = document.getElementById('annualCurrencySymbol');

function updateCurrencySymbols() {
  const currency = currencySelect.value;
  let symbol = '$';
  if (currency === 'eur') symbol = '€';
  currentCurrencySymbol.textContent = symbol;
  annualCurrencySymbol.textContent = symbol;
}

currencySelect.addEventListener('change', updateCurrencySymbols);

// Initialize symbols on page load
updateCurrencySymbols();

// Retirement Calculator Script

// Get DOM elements
const modal = document.getElementById('resultModal');
const closeBtn = document.querySelector('.close');
const savingsForm = document.getElementById('savingsForm');
const modalResult = document.getElementById('modalResult');

/**
 * Calculate estimated retirement savings based on user input.
 * Uses compound interest formula with annual contributions.
 * @param {number} currentSavings - Initial savings amount
 * @param {number} annualSavings - Amount saved each year
 * @param {number} expectedReturn - Expected annual return (percent)
 * @param {number} yearsToRetirement - Number of years until retirement
 * @returns {number} Estimated total savings at retirement
 */
function calculateRetirementSavings(currentSavings, annualSavings, expectedReturn, yearsToRetirement) {
  let total = currentSavings;
  const rate = expectedReturn / 100;
  for (let i = 1; i <= yearsToRetirement; i++) {
    total += annualSavings;
    total *= (1 + rate);
  }
  return total;
}

// Handle form submission
savingsForm.addEventListener('submit', function(event) {
  event.preventDefault();
  // Parse and validate input values
  const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
  const annualSavings = parseFloat(document.getElementById('annualSavings').value) || 0;
  const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 0;
  const yearsToRetirement = parseInt(document.getElementById('yearsToRetirement').value, 10) || 0;
  const currency = document.getElementById('currency').value;

  if (yearsToRetirement < 1) {
    modalResult.textContent = 'Years to retirement must be at least 1.';
    modal.style.display = 'block';
    return;
  }

  const totalSavings = calculateRetirementSavings(currentSavings, annualSavings, expectedReturn, yearsToRetirement);
  let symbol = '$';
  if (currency === 'eur') symbol = '€';
  modalResult.textContent = `Estimated retirement savings: ${symbol}${totalSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  modal.style.display = 'block';
});

// Close modal when close button is clicked
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Close modal when clicking outside modal content
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
