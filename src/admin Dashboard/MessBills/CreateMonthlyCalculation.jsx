import React from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';

const MONTH_OPTIONS = [
  { label: 'January', value: 'Jan' },
  { label: 'February', value: 'Feb' },
  { label: 'March', value: 'Mar' },
  { label: 'April', value: 'Apr' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'Jun' },
  { label: 'July', value: 'Jul' },
  { label: 'August', value: 'Aug' },
  { label: 'September', value: 'Sep' },
  { label: 'October', value: 'Oct' },
  { label: 'November', value: 'Nov' },
  { label: 'December', value: 'Dec' },
];

const CreateMonthlyCalculation = ({
  isDarkMode,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  groceryCost,
  setGroceryCost,
  vegetableCost,
  setVegetableCost,
  gasCharges,
  setGasCharges,
  milkLitres,
  setMilkLitres,
  milkCostPerLitre,
  setMilkCostPerLitre,
  otherCosts,
  setOtherCosts,
  deductions,
  setDeductions,
  students1st,
  setStudents1st,
  days1st,
  setDays1st,
  students2nd,
  setStudents2nd,
  days2nd,
  setDays2nd,
  students3rd,
  setStudents3rd,
  days3rd,
  setDays3rd,
  students4th,
  setStudents4th,
  days4th,
  setDays4th,
  reductionDays,
  setReductionDays,
  vegExtraPerDay,
  setVegExtraPerDay,
  nonVegExtraPerDay,
  setNonVegExtraPerDay,
  fieldErrors,
  formTouched,
  touchedFields,
  handleFieldBlur,
  handleNumericChange,
  handleCalculate,
  handleDownloadExcel,
}) => {
  const inputClass = `w-full rounded-md border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  return (
    <Card className="space-y-6" isDarkMode={isDarkMode}>
      <CardHeader>
        <div className="space-y-2 text-left">
          <h2 className="text-xl font-semibold">Create Monthly Calculation</h2>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            Input month-wise mess expenditure and attendance values. The calculation updates instantly.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border p-6 shadow-lg">
              <h3 className="text-lg font-semibold">Month & Cost Details</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    onBlur={() => handleFieldBlur('selectedMonth')}
                    className={inputClass}
                  >
                    <option value="">Select month</option>
                    {MONTH_OPTIONS.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.selectedMonth && (formTouched || touchedFields.selectedMonth) && (
                    <p className="text-xs text-rose-400">{fieldErrors.selectedMonth}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <input
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(event.target.value.replace(/[^\d]/g, ''))}
                    onBlur={() => handleFieldBlur('selectedYear')}
                    placeholder="Enter year"
                    className={inputClass}
                  />
                  {fieldErrors.selectedYear && (formTouched || touchedFields.selectedYear) && (
                    <p className="text-xs text-rose-400">{fieldErrors.selectedYear}</p>
                  )}
                </div>
                {[{
                  label: 'Grocery Cost',
                  value: groceryCost,
                  setter: setGroceryCost,
                  key: 'groceryCost',
                },
                {
                  label: 'Vegetable Cost',
                  value: vegetableCost,
                  setter: setVegetableCost,
                  key: 'vegetableCost',
                },
                {
                  label: 'Gas Charges',
                  value: gasCharges,
                  setter: setGasCharges,
                  key: 'gasCharges',
                },
                {
                  label: 'Other Costs',
                  value: otherCosts,
                  setter: setOtherCosts,
                  key: 'otherCosts',
                },
                {
                  label: 'Income / Deductions',
                  value: deductions,
                  setter: setDeductions,
                  key: 'deductions',
                }].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    <input
                      value={field.value}
                      onChange={handleNumericChange(field.key, field.setter)}
                      onBlur={() => handleFieldBlur(field.key)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={inputClass}
                    />
                    {fieldErrors[field.key] && (formTouched || touchedFields[field.key]) && (
                      <p className="text-xs text-rose-400">{fieldErrors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-6 shadow-lg">
              <h3 className="text-lg font-semibold">Milk & Extras</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {[{
                  label: 'Total Milk (litres)',
                  value: milkLitres,
                  setter: setMilkLitres,
                  key: 'milkLitres',
                },
                {
                  label: 'Milk Cost per Litre',
                  value: milkCostPerLitre,
                  setter: setMilkCostPerLitre,
                  key: 'milkCostPerLitre',
                },
                {
                  label: 'Veg Extra per Day',
                  value: vegExtraPerDay,
                  setter: setVegExtraPerDay,
                  key: 'vegExtraPerDay',
                },
                {
                  label: 'Non-Veg Extra per Day',
                  value: nonVegExtraPerDay,
                  setter: setNonVegExtraPerDay,
                  key: 'nonVegExtraPerDay',
                }].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    <input
                      value={field.value}
                      onChange={handleNumericChange(field.key, field.setter)}
                      onBlur={() => handleFieldBlur(field.key)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={inputClass}
                    />
                    {fieldErrors[field.key] && (formTouched || touchedFields[field.key]) && (
                      <p className="text-xs text-rose-400">{fieldErrors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border p-6 shadow-lg">
              <h3 className="text-lg font-semibold">Attendance Overview</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                {[{
                  label: '1st Year Students',
                  value: students1st,
                  setter: setStudents1st,
                  key: 'students1st',
                },
                {
                  label: '1st Year Days',
                  value: days1st,
                  setter: setDays1st,
                  key: 'days1st',
                  allowDecimal: false,
                },
                {
                  label: '2nd Year Students',
                  value: students2nd,
                  setter: setStudents2nd,
                  key: 'students2nd',
                },
                {
                  label: '2nd Year Days',
                  value: days2nd,
                  setter: setDays2nd,
                  key: 'days2nd',
                  allowDecimal: false,
                },
                {
                  label: '3rd Year Students',
                  value: students3rd,
                  setter: setStudents3rd,
                  key: 'students3rd',
                },
                {
                  label: '3rd Year Days',
                  value: days3rd,
                  setter: setDays3rd,
                  key: 'days3rd',
                  allowDecimal: false,
                },
                {
                  label: '4th Year Students',
                  value: students4th,
                  setter: setStudents4th,
                  key: 'students4th',
                },
                {
                  label: '4th Year Days',
                  value: days4th,
                  setter: setDays4th,
                  key: 'days4th',
                  allowDecimal: false,
                },
                {
                  label: 'Reduction Days',
                  value: reductionDays,
                  setter: setReductionDays,
                  key: 'reductionDays',
                  allowDecimal: false,
                }].map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    <input
                      value={field.value}
                      onChange={handleNumericChange(field.key, field.setter, field.allowDecimal !== false)}
                      onBlur={() => handleFieldBlur(field.key)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={inputClass}
                    />
                    {fieldErrors[field.key] && (formTouched || touchedFields[field.key]) && (
                      <p className="text-xs text-rose-400">{fieldErrors[field.key]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border p-6 shadow-lg">
              <h3 className="text-lg font-semibold">Confirm & Save</h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Validate all mandatory fields and click confirm to regenerate the live monthly calculation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={handleCalculate}
                  variant="primary"
                  isDarkMode={isDarkMode}
                  className="shadow-md"
                >
                  Confirm Calculation
                </Button>
                <Button
                  onClick={handleDownloadExcel}
                  variant="outline"
                  isDarkMode={isDarkMode}
                >
                  Download Current Snapshot
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateMonthlyCalculation;
