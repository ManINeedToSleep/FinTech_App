/**
 * Financial Calculator Page
 * 
 * Provides various financial calculation tools:
 * - Savings calculator (compound interest)
 * - Loan calculator (monthly payments)
 * - Tax calculator
 * - Investment calculator
 * 
 * Features:
 * - Real-time calculations
 * - Input validation
 * - Detailed results display
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  faCalculator, faChartLine, faPiggyBank, 
  faHandHoldingDollar, faCoins, faPercent
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CosmicBackground from '@/components/background/CosmicBackground';
import FloatingIcons from '@/components/background/FloatingIcons';

type CalculatorType = 'savings' | 'loan' | 'tax' | 'investment' | 'retirement' | 'mortgage';

export default function Calculator() {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('savings');
  const [result, setResult] = useState<string | null>(null);

  // Savings Calculator
  const [monthlySavings, setMonthlySavings] = useState('');
  const [years, setYears] = useState('');
  const [interestRate, setInterestRate] = useState('');

  // Loan Calculator
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [loanRate, setLoanRate] = useState('');

  // Tax Calculator
  const [annualIncome, setAnnualIncome] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [deductions, setDeductions] = useState('');

  // Investment Calculator
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [investmentYears, setInvestmentYears] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');

  // Retirement Calculator
  const [retirementAge, setRetirementAge] = useState('');
  const [currentAge, setCurrentAge] = useState('');

  // Mortgage Calculator
  const [mortgageAmount, setMortgageAmount] = useState('');
  const [downPayment, setDownPayment] = useState('');

  const calculateSavings = () => {
    const monthly = parseFloat(monthlySavings);
    const period = parseFloat(years) * 12;
    const rate = parseFloat(interestRate) / 100 / 12;
    
    const futureValue = monthly * ((Math.pow(1 + rate, period) - 1) / rate);
    const totalContributions = monthly * period;
    const interestEarned = futureValue - totalContributions;
    
    setResult(`
Future Value: $${futureValue.toFixed(2)}
Total Contributions: $${totalContributions.toFixed(2)}
Interest Earned: $${interestEarned.toFixed(2)}
Monthly Savings Required: $${monthly.toFixed(2)}
    `);
  };

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(loanRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    
    setResult(`Monthly Payment: $${monthlyPayment.toFixed(2)}\nTotal Payment: $${totalPayment.toFixed(2)}`);
  };

  const calculateTax = () => {
    const income = parseFloat(annualIncome);
    const rate = parseFloat(taxRate) / 100;
    const deduct = parseFloat(deductions) || 0;
    
    const taxableIncome = income - deduct;
    const taxAmount = taxableIncome * rate;
    const netIncome = income - taxAmount;
    
    setResult(`Tax Amount: $${taxAmount.toFixed(2)}\nNet Income: $${netIncome.toFixed(2)}`);
  };

  const calculateInvestment = () => {
    const initial = parseFloat(initialInvestment);
    const monthly = parseFloat(monthlyContribution);
    const years = parseFloat(investmentYears);
    const rate = parseFloat(expectedReturn) / 100 / 12;
    
    const futureValue = initial * Math.pow(1 + rate, years * 12) +
      monthly * ((Math.pow(1 + rate, years * 12) - 1) / rate);
    
    setResult(`Future Investment Value: $${futureValue.toFixed(2)}`);
  };

  const calculateMortgage = () => {
    const principal = parseFloat(mortgageAmount) - parseFloat(downPayment);
    const monthlyRate = parseFloat(loanRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    setResult(`
Monthly Payment: $${monthlyPayment.toFixed(2)}
Total Payment: $${totalPayment.toFixed(2)}
Total Interest: $${totalInterest.toFixed(2)}
Loan-to-Value Ratio: ${((principal / parseFloat(mortgageAmount)) * 100).toFixed(1)}%
    `);
  };

  const calculateRetirement = () => {
    const currentAgeNum = parseFloat(currentAge);
    const retirementAgeNum = parseFloat(retirementAge);
    const yearsToRetirement = retirementAgeNum - currentAgeNum;
    const monthlyContributionNum = parseFloat(monthlyContribution);
    const rateOfReturn = parseFloat(expectedReturn) / 100;
    const initialAmount = parseFloat(initialInvestment);

    const futureValue = initialAmount * Math.pow(1 + rateOfReturn, yearsToRetirement) +
      monthlyContributionNum * 12 * 
      ((Math.pow(1 + rateOfReturn, yearsToRetirement) - 1) / rateOfReturn);

    const totalContributions = initialAmount + (monthlyContributionNum * 12 * yearsToRetirement);
    const interestEarned = futureValue - totalContributions;

    setResult(`
Estimated Retirement Savings: $${futureValue.toFixed(2)}
Total Contributions: $${totalContributions.toFixed(2)}
Investment Returns: $${interestEarned.toFixed(2)}
Years to Retirement: ${yearsToRetirement}
Monthly Contribution Required: $${monthlyContributionNum.toFixed(2)}
    `);
  };

  return (
    <div className="min-h-screen bg-nordic-blue relative overflow-hidden">
      <CosmicBackground />
      <FloatingIcons />

      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur-sm border-b border-frost-blue/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 items-center">
              <span className="text-xl font-semibold text-aurora-green">Fintech Financial Bank</span>
              <div className="flex space-x-4">
                <Link 
                  href="/dashboard" 
                  className="text-frost-blue hover:text-aurora-green transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                >
                  Home
                </Link>
                <Link 
                  href="/dashboard/calculator" 
                  className="text-aurora-green bg-white/5 transition-colors px-3 py-2 rounded-md"
                >
                  Calculator
                </Link>
                <Link 
                  href="/dashboard/analytics" 
                  className="text-frost-blue hover:text-aurora-green transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                >
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="glass-card rounded-xl p-6 border border-frost-blue/10">
          <h2 className="text-2xl font-bold text-snow-white mb-6">Financial Calculator</h2>

          {/* Calculator Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { type: 'savings', icon: faPiggyBank, label: 'Savings' },
              { type: 'loan', icon: faHandHoldingDollar, label: 'Loan' },
              { type: 'investment', icon: faChartLine, label: 'Investment' },
              { type: 'tax', icon: faPercent, label: 'Tax' },
              { type: 'retirement', icon: faCoins, label: 'Retirement' },
              { type: 'mortgage', icon: faCalculator, label: 'Mortgage' },
            ].map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => {
                  setCalculatorType(type as CalculatorType);
                  setResult(null);
                }}
                className={`p-4 rounded-xl border transition-all ${
                  calculatorType === type
                    ? 'bg-aurora-green/20 border-aurora-green text-aurora-green'
                    : 'bg-white/5 border-frost-blue/10 text-frost-blue hover:bg-white/10'
                }`}
              >
                <FontAwesomeIcon icon={icon} className="text-2xl mb-2" />
                <div className="text-sm font-medium">{label}</div>
              </button>
            ))}
          </div>

          {/* Calculator Forms */}
          <div className="space-y-4">
            {calculatorType === 'savings' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Monthly Savings ($)
                  </label>
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Years
                  </label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <button
                  onClick={calculateSavings}
                  className="w-full py-2 px-4 bg-aurora-green text-nordic-blue rounded-lg 
                            font-medium hover:bg-aurora-green/90 transition-colors"
                >
                  Calculate
                </button>
              </>
            )}

            {calculatorType === 'loan' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Loan Term (Years)
                  </label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={loanRate}
                    onChange={(e) => setLoanRate(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <button
                  onClick={calculateLoan}
                  className="w-full py-2 px-4 bg-aurora-green text-nordic-blue rounded-lg 
                            font-medium hover:bg-aurora-green/90 transition-colors"
                >
                  Calculate
                </button>
              </>
            )}

            {calculatorType === 'tax' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Annual Income ($)
                  </label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Deductions ($)
                  </label>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <button
                  onClick={calculateTax}
                  className="w-full py-2 px-4 bg-aurora-green text-nordic-blue rounded-lg 
                            font-medium hover:bg-aurora-green/90 transition-colors"
                >
                  Calculate
                </button>
              </>
            )}

            {calculatorType === 'investment' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Initial Investment ($)
                  </label>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Monthly Contribution ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Investment Period (Years)
                  </label>
                  <input
                    type="number"
                    value={investmentYears}
                    onChange={(e) => setInvestmentYears(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Expected Annual Return (%)
                  </label>
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <button
                  onClick={calculateInvestment}
                  className="w-full py-2 px-4 bg-aurora-green text-nordic-blue rounded-lg 
                            font-medium hover:bg-aurora-green/90 transition-colors"
                >
                  Calculate
                </button>
              </>
            )}

            {calculatorType === 'retirement' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Retirement Age
                  </label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-frost-blue mb-1">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                  />
                </div>
                <button
                  onClick={calculateRetirement}
                  className="w-full py-2 px-4 bg-aurora-green text-nordic-blue rounded-lg 
                            font-medium hover:bg-aurora-green/90 transition-colors"
                >
                  Calculate
                </button>
              </>
            )}

            {calculatorType === 'mortgage' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-frost-blue mb-1">
                      Property Value ($)
                    </label>
                    <input
                      type="number"
                      value={mortgageAmount}
                      onChange={(e) => setMortgageAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-frost-blue mb-1">
                      Down Payment ($)
                    </label>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-frost-blue/20 rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-aurora-green text-snow-white"
                    />
                  </div>
                </div>
                <button
                  onClick={calculateMortgage}
                  className="w-full py-2 px-4 bg-aurora-green text-nordic-blue rounded-lg 
                            font-medium hover:bg-aurora-green/90 transition-colors"
                >
                  Calculate
                </button>
              </div>
            )}

            {result && (
              <div className="mt-6 p-6 bg-white/5 rounded-xl border border-frost-blue/10">
                <h3 className="text-lg font-medium text-aurora-green mb-4">Results</h3>
                <pre className="whitespace-pre-wrap font-mono text-sm text-snow-white">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 