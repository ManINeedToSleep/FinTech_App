'use client';

import { useState } from 'react';
import Link from 'next/link';

type CalculatorType = 'savings' | 'loan' | 'tax' | 'investment';

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

  const calculateSavings = () => {
    const monthly = parseFloat(monthlySavings);
    const period = parseFloat(years) * 12;
    const rate = parseFloat(interestRate) / 100 / 12;
    
    const futureValue = monthly * ((Math.pow(1 + rate, period) - 1) / rate);
    setResult(`Future Savings: $${futureValue.toFixed(2)}`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex space-x-8 items-center">
              <span className="text-xl font-semibold text-blue-600">FinTech</span>
              <div className="flex space-x-4">
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Home
                </Link>
                <Link 
                  href="/calculator" 
                  className="text-blue-600 transition-colors px-3 py-2 rounded-md bg-gray-50"
                >
                  Calculator
                </Link>
                <Link 
                  href="/analytics" 
                  className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-2">
              {(['savings', 'loan', 'tax', 'investment'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setCalculatorType(type);
                    setResult(null);
                  }}
                  className={`p-3 rounded-lg capitalize ${
                    calculatorType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {calculatorType === 'savings' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Savings ($)</label>
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Years</label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={calculateSavings}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Calculate Savings
                </button>
              </>
            )}

            {calculatorType === 'loan' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Amount ($)</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Loan Term (Years)</label>
                  <input
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    value={loanRate}
                    onChange={(e) => setLoanRate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={calculateLoan}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Calculate Loan
                </button>
              </>
            )}

            {calculatorType === 'tax' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Income ($)</label>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deductions ($)</label>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={calculateTax}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Calculate Tax
                </button>
              </>
            )}

            {calculatorType === 'investment' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Initial Investment ($)</label>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Contribution ($)</label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Investment Period (Years)</label>
                  <input
                    type="number"
                    value={investmentYears}
                    onChange={(e) => setInvestmentYears(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expected Annual Return (%)</label>
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={calculateInvestment}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Calculate Investment
                </button>
              </>
            )}

            {result && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <pre className="whitespace-pre-wrap font-mono text-sm">
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