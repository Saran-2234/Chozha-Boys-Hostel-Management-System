import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';

const MonthlyCalculations = ({
  isDarkMode,
  monthlyData,
  loadingMonthly,
  monthlyError,
  selectedMonthId,
  setSelectedMonthId,
  fetchMonthlyCalculations,
  onEdit,
  onConfirm,
  selectedMonthData,
  formattedCurrency,
  isVerificationStep = false,
  newCalculationId = null,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  return (
    <Card className="space-y-6" isDarkMode={isDarkMode}>
      <CardHeader>
        <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {isVerificationStep ? 'Verify Monthly Calculation' : 'Monthly Calculations'}
            </h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              {isVerificationStep
                ? 'Review the newly created calculation before proceeding.'
                : 'View and select from all monthly mess bill calculations.'
              }
            </p>
          </div>
          <div className="flex gap-3">
            {!isVerificationStep && (
              <>
                <Button
                  onClick={() => {
                    fetchMonthlyCalculations();
                    setShowDetails(false);
                  }}
                  variant="outline"
                  isDarkMode={isDarkMode}
                  disabled={loadingMonthly}
                >
                  {loadingMonthly ? 'Loading...' : 'Refresh'}
                </Button>
                <Button
                  onClick={onEdit}
                  variant="primary"
                  isDarkMode={isDarkMode}
                  className="shadow-md"
                >
                  Edit Bill
                </Button>
              </>
            )}
            {isVerificationStep && (
              <>
                <Button
                  onClick={onEdit}
                  variant="outline"
                  isDarkMode={isDarkMode}
                >
                  Edit
                </Button>
                <Button
                  onClick={onConfirm}
                  variant="primary"
                  isDarkMode={isDarkMode}
                  className="shadow-md"
                >
                  Confirm & Proceed
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {monthlyError && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {monthlyError}
          </div>
        )}

        {monthlyData.length > 0 && (
          <div className="space-y-4">
            {!isVerificationStep && (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="text-sm font-medium">Select Month:</label>
                <select
                  value={selectedMonthId || ''}
                  onChange={(e) => setSelectedMonthId(parseInt(e.target.value))}
                  className={`w-full sm:w-64 rounded-md border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-gray-100'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {monthlyData.map((item) => (
                    <option key={item.monthly_base_costs_id} value={item.monthly_base_costs_id}>
                      {item.month_year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isVerificationStep && (
              <div className={`overflow-hidden rounded-2xl border shadow-lg ${
                isDarkMode ? 'border-slate-700 bg-slate-900/60' : 'border-white/50 bg-white/85 backdrop-blur-xl'
              }`}>
                <div className={isDarkMode ? 'border-b border-slate-700 px-6 py-4' : 'border-b border-white/60 px-6 py-4'}>
                  <h3 className="text-lg font-semibold">All Monthly Calculations</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Overview of all saved monthly calculations.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className={isDarkMode ? 'bg-slate-800/70 text-slate-200' : 'bg-indigo-50/60 text-indigo-900'}>
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-24">Month/Year</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-32">Total Expenditure</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-32">Net Expenditure</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-28">Mess Fee/Day</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-24">Students</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-24">Created</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider w-20">Actions</th>
                      </tr>
                    </thead>
                    <tbody className={isDarkMode ? 'divide-y divide-slate-800 bg-slate-900/40' : 'divide-y divide-slate-100 bg-white/80'}>
                      {monthlyData.map((item) => (
                        <tr
                          key={item.monthly_base_costs_id}
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedMonthId === item.monthly_base_costs_id
                              ? (isDarkMode ? 'bg-blue-900/30 shadow-md' : 'bg-blue-50 shadow-md')
                              : (isDarkMode ? 'hover:bg-slate-800/60 hover:shadow-sm' : 'hover:bg-slate-50 hover:shadow-sm')
                          }`}
                          onClick={() => setSelectedMonthId(item.monthly_base_costs_id)}
                        >
                          <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">{item.month_year}</td>
                          <td className="px-4 py-4 text-sm font-semibold text-indigo-500 whitespace-nowrap">
                            {formattedCurrency(item.total_expenditure)}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-indigo-500 whitespace-nowrap">
                            {formattedCurrency(item.expenditure_after_income)}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-indigo-500 whitespace-nowrap">
                            {formattedCurrency(item.mess_fee_per_day)}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-center">
                            {item.years_data?.reduce((sum, y) => sum + (y.total_students || 0), 0) || 0}
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMonthId(item.monthly_base_costs_id);
                                setShowDetails(true);
                              }}
                              variant="primary"
                              isDarkMode={isDarkMode}
                              size="sm"
                              className="transition-all duration-200 hover:scale-105 hover:shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium"
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {selectedMonthData && showDetails && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[{
                label: 'Total Expenditure',
                value: formattedCurrency(selectedMonthData.total_expenditure),
                tone: 'from-indigo-500/90 via-indigo-500/70 to-indigo-600/80',
              },
              {
                label: 'Total Income',
                value: formattedCurrency(selectedMonthData.deductions_income),
                tone: 'from-emerald-500/90 via-emerald-500/70 to-emerald-600/80',
              },
              {
                label: 'Net Expenditure',
                value: formattedCurrency(selectedMonthData.expenditure_after_income),
                tone: 'from-amber-500/90 via-amber-500/70 to-amber-600/80',
              },
              {
                label: 'Applicable Student Days',
                value: selectedMonthData.years_data?.reduce((sum, y) => sum + ((y.total_students || 0) * (y.total_days || 0)), 0).toLocaleString() || '0',
                tone: 'from-purple-500/90 via-purple-500/70 to-purple-600/80',
              },
              {
                label: 'Mess Fee / Day',
                value: formattedCurrency(selectedMonthData.mess_fee_per_day),
                tone: 'from-sky-500/90 via-sky-500/70 to-sky-600/80',
              },
              {
                label: 'Total Students',
                value: selectedMonthData.years_data?.reduce((sum, y) => sum + (y.total_students || 0), 0).toLocaleString() || '0',
                tone: 'from-rose-500/90 via-rose-500/70 to-rose-600/80',
              },
              {
                label: 'Total Milk Litres',
                value: selectedMonthData.total_milk_litres ? selectedMonthData.total_milk_litres.toLocaleString() + ' L' : '0 L',
                tone: 'from-cyan-500/90 via-cyan-500/70 to-cyan-600/80',
              },
              {
                label: 'Veg Extra/Day',
                value: formattedCurrency(selectedMonthData.veg_extra_per_day),
                tone: 'from-green-500/90 via-green-500/70 to-green-600/80',
              },
              {
                label: 'Non-Veg Extra/Day',
                value: formattedCurrency(selectedMonthData.nonveg_extra_per_day),
                tone: 'from-red-500/90 via-red-500/70 to-red-600/80',
              }].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl border border-white/10 p-5 text-center shadow-lg backdrop-blur-xl ${
                    isDarkMode ? 'bg-slate-800/60' : 'bg-gradient-to-br ' + item.tone
                  }`}
                >
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-white/80'}`}>
                    {item.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className={`overflow-hidden rounded-2xl border shadow-lg ${
              isDarkMode ? 'border-slate-700 bg-slate-900/60' : 'border-white/50 bg-white/85 backdrop-blur-xl'
            }`}>
              <div className={isDarkMode ? 'border-b border-slate-700 px-6 py-4' : 'border-b border-white/60 px-6 py-4'}>
                <h3 className="text-lg font-semibold">Cost Breakdown</h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Inspect the individual cost components contributing to this month&#39;s mess bill.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className={isDarkMode ? 'bg-slate-800/70 text-slate-200' : 'bg-indigo-50/60 text-indigo-900'}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Cost Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Additional Notes</th>
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? 'divide-y divide-slate-800 bg-slate-900/40' : 'divide-y divide-slate-100 bg-white/80'}>
                    {[{
                      label: 'Grocery Cost',
                      value: formattedCurrency(selectedMonthData.grocery_cost),
                      note: 'Staple supplies & dry provisions',
                    },
                    {
                      label: 'Vegetable Cost',
                      value: formattedCurrency(selectedMonthData.vegetable_cost),
                      note: 'Fresh produce & leafy greens',
                    },
                    {
                      label: 'Gas Charges',
                      value: formattedCurrency(selectedMonthData.gas_charges),
                      note: 'Cooking fuel usage',
                    },
                    {
                      label: 'Milk Charges',
                      value: formattedCurrency(selectedMonthData.milk_charges_computed),
                      note: 'Total litres × cost per litre',
                    },
                    {
                      label: 'Other Costs',
                      value: formattedCurrency(selectedMonthData.other_costs),
                      note: 'Maintenance, supplies & contingencies',
                    },
                    {
                      label: 'Income / Deductions',
                      value: formattedCurrency(selectedMonthData.deductions_income),
                      note: 'Donations, refunds or adjustments',
                    }].map((row) => (
                      <tr key={row.label}>
                        <td className="px-6 py-4 text-sm font-medium">{row.label}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-indigo-500">
                          {row.value}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={`rounded-2xl border p-6 shadow-lg ${
              isDarkMode ? 'border-slate-700 bg-slate-900/60' : 'border-white/50 bg-white/85 backdrop-blur-xl'
            }`}>
              <h3 className="text-lg font-semibold">Year-wise Attendance Snapshot</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {selectedMonthData.years_data?.map((year) => (
                  <div
                    key={year.year}
                    className={`rounded-xl border p-4 transition ${
                      isDarkMode ? 'border-slate-700 bg-slate-900/80' : 'border-indigo-100 bg-indigo-50/70'
                    }`}
                  >
                    <p className="text-sm font-semibold text-indigo-500">{year.year}{year.year === 1 ? 'st' : year.year === 2 ? 'nd' : year.year === 3 ? 'rd' : 'th'} Year</p>
                    <div className="mt-3 flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Students</p>
                        <p className="text-xl font-bold">{year.total_students}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-slate-400">Days</p>
                        <p className="text-xl font-bold">{year.total_days}</p>
                      </div>
                    </div>
                  </div>
                )) || []}
              </div>
            </div>
          </>
        )}

        {!loadingMonthly && monthlyData.length === 0 && !monthlyError && (
          <div className="text-center py-8">
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              No monthly calculations found. Create your first calculation to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyCalculations;
