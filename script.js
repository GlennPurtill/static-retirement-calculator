// Update currency symbols in input fields when currency changes
const currencySelect = document.getElementById('currency');

/**
 * Updates the currency symbols displayed in the input fields
 * based on the selected currency from the dropdown.
 */
function updateCurrencySymbols() {
  // Symbols inside inputs removed; keep function for future reinstatement
}

currencySelect.addEventListener('change', updateCurrencySymbols);

// Initialize symbols on page load
updateCurrencySymbols();

// Get DOM elements
const modal = document.getElementById('resultModal');
const closeBtn = document.querySelector('.close');
const savingsForm = document.getElementById('savingsForm');
const modalResult = document.getElementById('modalResult');

/**
 * Calculate estimated retirement savings based on user input.
 * Uses compound interest formula with annual contributions.
 *
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

/**
 * Handles the form submission event, validates input,
 * performs the retirement savings calculation, and displays the result in a modal.
 */

savingsForm.addEventListener('submit', function(event) {
  event.preventDefault();
  // Parse and validate input values
  const currentSavings = parseFloat(document.getElementById('currentSavings').value) || 0;
  const annualSavings = parseFloat(document.getElementById('annualSavings').value) || 0;
  const currentAge = parseInt(document.getElementById('currentAge').value, 10) || 0;
  const expectedReturn = parseFloat(document.getElementById('expectedReturn').value) || 0;
  const expectedInflation = parseFloat(document.getElementById('expectedInflation').value) || 0;
  const retirementAge = parseInt(document.getElementById('retirementAge').value, 10) || 0;
  const expectedCosts = parseFloat(document.getElementById('expectedCosts').value) || 0;
  const currency = document.getElementById('currency').value;

  if (currentAge < 0 || retirementAge <= currentAge) {
    modalResult.textContent = 'Retirement age must be greater than current age.';
    modal.style.display = 'block';
    return;
  }
  const yearsToRetirement = retirementAge - currentAge;
  const yearsToSimulate = 50; // simulate up to 50 years after current age for long-term view

  // Table calculation
  let symbol = '$';
  if (currency === 'eur') symbol = '€';
  let rows = [];
  let yearStart = currentSavings;
  const rate = expectedReturn / 100;
  let inflationRate = expectedInflation / 100;
  let adjustedAnnual = annualSavings; // start with entered annual savings, inflate each year
  let adjustedCosts = expectedCosts; // start with entered costs, inflate each year
  let retired = false;
  let lastAge = currentAge;
  let i = 0;
  let stop = false;
  let age = currentAge;
  while (!stop) {
    let added = 0;
    let label = '';
    if (age < retirementAge) {
      // Pre-retirement: add annual savings
      added = adjustedAnnual;
      label = 'Contribution';
    } else if (age === retirementAge) {
      // Last year of contributions
      added = adjustedAnnual;
      label = 'Contribution';
    } else {
      // Post-retirement: subtract annual deductions
      added = -adjustedCosts;
      label = 'Deduction';
    }
    let organicGrowth = (yearStart + added) * rate;
    let yearEnd = (yearStart + added) * (1 + rate);
    rows.push({
      age,
      yearStart,
      added,
      organicGrowth,
      yearEnd,
      label
    });
    yearStart = yearEnd;
    // Grow both annual savings and deductions by inflation every year
    adjustedAnnual *= (1 + inflationRate);
    adjustedCosts *= (1 + inflationRate);
    // Stop if balance is depleted after retirement or age reaches 100
    if ((age > retirementAge && yearEnd <= 0) || age >= 100) {
      lastAge = age;
      stop = true;
    }
    age++;
    i++;
  }
  const totalSavings = rows.length ? rows[rows.length-1].yearEnd : currentSavings;

  // Find savings at retirement year
  let savingsAtRetirement = null;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].age === retirementAge) {
      savingsAtRetirement = rows[i].yearEnd;
      break;
    }
  }
  // Build table HTML
  let table = `<div class="table-animate table-wrapper"><table class="breakdown-table"><thead><tr><th>Age</th><th>Start Balance</th><th>Annual Contributions / Deductions</th><th>Investment Growth</th><th>End Balance</th></tr></thead><tbody>`;
  rows.forEach(r => {
    table += `<tr><td>${r.age}</td><td>${symbol}${r.yearStart.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td><td>${r.added >= 0 ? '+' : '-'}${symbol}${Math.abs(r.added).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td><td>${symbol}${r.organicGrowth.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td><td>${symbol}${r.yearEnd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td></tr>`;
  });
  table += `</tbody></table></div>`;

  let summary = '';
  // Find the age at which money runs out (if any)
  let depletionAge = null;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].age > retirementAge && rows[i].yearEnd <= 0) {
      depletionAge = rows[i].age;
      break;
    }
  }
  if (depletionAge !== null && depletionAge <= 100) {
    summary += `<div style="color:#c62828;font-weight:bold;margin-bottom:8px;">You will run out of money at age ${depletionAge}.</div>`;
  }
  if (savingsAtRetirement !== null) {
    summary += `<div style="font-weight:bold;margin-bottom:8px;">Estimated savings at retirement (age ${retirementAge}): ${symbol}${savingsAtRetirement.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>`;
  }
  summary += `<div style="font-weight:normal;margin-bottom:12px;">Estimated balance at end of simulation: ${symbol}${totalSavings.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>`;

  modalResult.innerHTML = summary + table;
  modal.style.display = 'block';
});

/**
 * Closes the result modal when the close button is clicked.
 */
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

/**
 * Closes the modal if the user clicks outside the modal content.
 * @param {Event} event - The click event
 */
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});
