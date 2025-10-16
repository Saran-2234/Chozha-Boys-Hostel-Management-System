import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import BillTable from './BillTable';

const REQUIRED_FIELD_LABELS = {
  groceryCost: 'Grocery cost',
  vegetableCost: 'Vegetable cost',
  gasCharges: 'Gas charge',
  milkLitres: 'Total milk litres',
  milkCostPerLitre: 'Milk cost per litre',
  otherCosts: 'Other costs',
  deductions: 'Income',
  students1st: '1st year students',
  days1st: '1st year days',
  students2nd: '2nd year students',
  days2nd: '2nd year days',
  students3rd: '3rd year students',
  days3rd: '3rd year days',
  students4th: '4th year students',
  days4th: '4th year days',
  reductionDays: 'Reduction days',
  vegExtraPerDay: 'Veg extra per day',
  nonVegExtraPerDay: 'Non-veg extra per day',
};

const sanitizeNumericInput = (value, allowDecimal = true) => {
  // Ensures only digits and a single decimal separator are retained.
  let sanitized = value.replace(/[^\d.]/g, '');

  if (!allowDecimal) {
    return sanitized.replace(/\./g, '');
  }

  const parts = sanitized.split('.');
  if (parts.length > 1) {
    sanitized = `${parts[0]}.${parts.slice(1).join('')}`;
  }

  if (sanitized.startsWith('.')) {
    sanitized = `0${sanitized}`;
  }

  return sanitized;
};

const MessBills = ({ isDarkMode }) => {
  // Input states
  const [groceryCost, setGroceryCost] = useState('');
  const [vegetableCost, setVegetableCost] = useState('');
  const [gasCharges, setGasCharges] = useState('');
  const [milkLitres, setMilkLitres] = useState('');
  const [milkCostPerLitre, setMilkCostPerLitre] = useState('');
  const [otherCosts, setOtherCosts] = useState('');
  const [deductions, setDeductions] = useState('');
  const [students1st, setStudents1st] = useState('');
  const [days1st, setDays1st] = useState('');
  const [students2nd, setStudents2nd] = useState('');
  const [days2nd, setDays2nd] = useState('');
  const [students3rd, setStudents3rd] = useState('');
  const [days3rd, setDays3rd] = useState('');
  const [students4th, setStudents4th] = useState('');
  const [days4th, setDays4th] = useState('');
  const [reductionDays, setReductionDays] = useState('');
  const [vegExtraPerDay, setVegExtraPerDay] = useState('');
  const [nonVegExtraPerDay, setNonVegExtraPerDay] = useState('');

  // Form validation state
  const [fieldErrors, setFieldErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  // Computed values
  const [milkCharges, setMilkCharges] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  // Calculation results
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [netExpenditure, setNetExpenditure] = useState(0);
  const [totalPossibleStudentDays, setTotalPossibleStudentDays] = useState(0);
  const [applicableStudentDays, setApplicableStudentDays] = useState(0);
  const [messFeePerDay, setMessFeePerDay] = useState(0);
  const [vegFeePerDay, setVegFeePerDay] = useState(0);
  const [nonVegFeePerDay, setNonVegFeePerDay] = useState(0);
  const [calculated, setCalculated] = useState(false);

  // Filters
  const [yearFilter, setYearFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const getFieldValues = () => ({
    groceryCost,
    vegetableCost,
    gasCharges,
    milkLitres,
    milkCostPerLitre,
    otherCosts,
    deductions,
    students1st,
    days1st,
    students2nd,
    days2nd,
    students3rd,
    days3rd,
    students4th,
    days4th,
    reductionDays,
    vegExtraPerDay,
    nonVegExtraPerDay,
  });

  const handleFieldBlur = (fieldKey) => {
    setTouchedFields((previous) => ({
      ...previous,
      [fieldKey]: true,
    }));

    setFieldErrors((previous) => {
      const updatedErrors = { ...previous };
      const currentValue = getFieldValues()[fieldKey];

      if (currentValue === '') {
        updatedErrors[fieldKey] = `${REQUIRED_FIELD_LABELS[fieldKey]} cannot be empty`;
      } else {
        delete updatedErrors[fieldKey];
      }

      return updatedErrors;
    });
  };

  const handleNumericChange = (fieldKey, setter, allowDecimal = true) => (event) => {
    const sanitizedValue = sanitizeNumericInput(event.target.value, allowDecimal);
    setter(sanitizedValue);

    setFieldErrors((previous) => {
      const updatedErrors = { ...previous };

      if (sanitizedValue === '') {
        updatedErrors[fieldKey] = `${REQUIRED_FIELD_LABELS[fieldKey]} cannot be empty`;
      } else {
        delete updatedErrors[fieldKey];
      }

      return updatedErrors;
    });
  };

  // Mock students data
  const mockStudents = [
    { id: 'ST001', name: 'John Doe', year: '1st', department: 'CSE', daysPresent: 28, vegDays: 28, nonVegDays: 0 },
    { id: 'ST002', name: 'Jane Smith', year: '2nd', department: 'ECE', daysPresent: 25, vegDays: 25, nonVegDays: 0 },
    { id: 'ST003', name: 'Bob Johnson', year: '3rd', department: 'MECH', daysPresent: 28, vegDays: 20, nonVegDays: 8 },
    // Add more mock data as needed
  ];

  useEffect(() => {
    const grocery = parseFloat(groceryCost || 0);
    const vegetable = parseFloat(vegetableCost || 0);
    const gas = parseFloat(gasCharges || 0);
    const milk = parseFloat(milkLitres || 0) * parseFloat(milkCostPerLitre || 0);
    const other = parseFloat(otherCosts || 0);
    const income = parseFloat(deductions || 0);
    const students1 = parseInt(students1st || 0);
    const days1 = parseInt(days1st || 0);
    const students2 = parseInt(students2nd || 0);
    const days2 = parseInt(days2nd || 0);
    const students3 = parseInt(students3rd || 0);
    const days3 = parseInt(days3rd || 0);
    const students4 = parseInt(students4th || 0);
    const days4 = parseInt(days4th || 0);
    const reduction = parseInt(reductionDays || 0);
    const vegExtra = parseFloat(vegExtraPerDay || 0);
    const nonVegExtra = parseFloat(nonVegExtraPerDay || 0);

    setMilkCharges(milk);

    const totalStudentsComputed = students1 + students2 + students3 + students4;
    setTotalStudents(totalStudentsComputed);

    const totalPossible = (students1 * days1) + (students2 * days2) + (students3 * days3) + (students4 * days4);
    const totalExp = grocery + vegetable + gas + milk + other;
    const netExp = totalExp - income;
    const applicable = totalPossible - reduction;
    const messFee = applicable > 0 ? Math.round(netExp / applicable) : 0;

    setTotalExpenditure(totalExp);
    setTotalIncome(income);
    setNetExpenditure(netExp);
    setTotalPossibleStudentDays(totalPossible);
    setApplicableStudentDays(applicable);
    setMessFeePerDay(messFee);
    setVegFeePerDay(vegExtra);
    setNonVegFeePerDay(nonVegExtra);
  }, [groceryCost, vegetableCost, gasCharges, milkLitres, milkCostPerLitre, otherCosts, deductions, students1st, days1st, students2nd, days2nd, students3rd, days3rd, students4th, days4th, reductionDays, vegExtraPerDay, nonVegExtraPerDay]);

  const validateForm = () => {
    const errors = {};

    Object.entries(REQUIRED_FIELD_LABELS).forEach(([key, label]) => {
      const inputValue = {
        groceryCost,
        vegetableCost,
        gasCharges,
        milkLitres,
        milkCostPerLitre,
        otherCosts,
        deductions,
        students1st,
        days1st,
        students2nd,
        days2nd,
        students3rd,
        days3rd,
        students4th,
        days4th,
        reductionDays,
        vegExtraPerDay,
        nonVegExtraPerDay,
      }[key];

      if (inputValue === '') {
        errors[key] = `${label} cannot be empty`;
      }
    });

    setFieldErrors(errors);
    return errors;
  };

  const handleCalculate = () => {
    const errors = validateForm();
    setFormTouched(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setCalculated(true);
    // Optional: Final confirmation or save logic
    console.log('Final calculation confirmed');
  };

  const handleBulkSendYearDept = () => {
    console.log(`Send bills to ${yearFilter} year ${departmentFilter} department`);
  };

  const handleSendAll = () => {
    console.log('Send bills to all students');
  };

  const handleDownloadExcel = () => {
    // Simulate Excel download
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(
      "Student ID,Student Name,Days Present,Mess Fee per Day,Mess Charges,Veg Days,Non-Veg Days,Total\n" +
      mockStudents.map(s => `${s.id},${s.name},${s.daysPresent},${messFeePerDay},${(s.daysPresent * messFeePerDay)},${s.vegDays},${s.nonVegDays},${(s.daysPresent * messFeePerDay + s.vegDays * vegFeePerDay + s.nonVegDays * nonVegFeePerDay)}`).join("\n")
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'mess_bills.csv');
    downloadAnchor.click();
  };

  const filteredStudents = mockStudents.filter(student => 
    (yearFilter === 'all' || student.year === yearFilter) &&
    (departmentFilter === 'all' || student.department === departmentFilter)
  );

  return (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Mess Bill Management
      </h2>

      {/* Input Panel */}
      <Card isDarkMode={isDarkMode}>
        <CardHeader>
          <h3 className="text-lg font-semibold">Monthly Calculation</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Grocery Cost</label>
              <input
                value={groceryCost}
                onChange={handleNumericChange('groceryCost', setGroceryCost)}
                onBlur={() => handleFieldBlur('groceryCost')}
                placeholder="Enter grocery cost"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.groceryCost && (formTouched || touchedFields.groceryCost) && (
                <p className="text-xs text-red-500">{fieldErrors.groceryCost}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Vegetable Cost</label>
              <input
                value={vegetableCost}
                onChange={handleNumericChange('vegetableCost', setVegetableCost)}
                onBlur={() => handleFieldBlur('vegetableCost')}
                placeholder="Enter vegetable cost"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.vegetableCost && (formTouched || touchedFields.vegetableCost) && (
                <p className="text-xs text-red-500">{fieldErrors.vegetableCost}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Gas Charges</label>
              <input
                value={gasCharges}
                onChange={handleNumericChange('gasCharges', setGasCharges)}
                onBlur={() => handleFieldBlur('gasCharges')}
                placeholder="Enter gas charges"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.gasCharges && (formTouched || touchedFields.gasCharges) && (
                <p className="text-xs text-red-500">{fieldErrors.gasCharges}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Total Milk Litres</label>
              <input
                value={milkLitres}
                onChange={handleNumericChange('milkLitres', setMilkLitres)}
                onBlur={() => handleFieldBlur('milkLitres')}
                placeholder="Enter total litres"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.milkLitres && (formTouched || touchedFields.milkLitres) && (
                <p className="text-xs text-red-500">{fieldErrors.milkLitres}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Milk Cost per Litre</label>
              <input
                value={milkCostPerLitre}
                onChange={handleNumericChange('milkCostPerLitre', setMilkCostPerLitre)}
                onBlur={() => handleFieldBlur('milkCostPerLitre')}
                placeholder="Enter cost per litre"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.milkCostPerLitre && (formTouched || touchedFields.milkCostPerLitre) && (
                <p className="text-xs text-red-500">{fieldErrors.milkCostPerLitre}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Milk Charges (Computed)</label>
              <input
                type="number"
                value={milkCharges}
                readOnly
                placeholder="Computed: Litres * Cost/Litre"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-not-allowed bg-gray-100 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Other Costs</label>
              <input
                value={otherCosts}
                onChange={handleNumericChange('otherCosts', setOtherCosts)}
                onBlur={() => handleFieldBlur('otherCosts')}
                placeholder="Enter other costs"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.otherCosts && (formTouched || touchedFields.otherCosts) && (
                <p className="text-xs text-red-500">{fieldErrors.otherCosts}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Deductions / Income</label>
              <input
                value={deductions}
                onChange={handleNumericChange('deductions', setDeductions)}
                onBlur={() => handleFieldBlur('deductions')}
                placeholder="Enter deductions"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.deductions && (formTouched || touchedFields.deductions) && (
                <p className="text-xs text-red-500">{fieldErrors.deductions}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>1st Year Students</label>
              <input
                value={students1st}
                onChange={handleNumericChange('students1st', setStudents1st, false)}
                onBlur={() => handleFieldBlur('students1st')}
                placeholder="Enter 1st year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.students1st && (formTouched || touchedFields.students1st) && (
                <p className="text-xs text-red-500">{fieldErrors.students1st}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>1st Year Days</label>
              <input
                value={days1st}
                onChange={handleNumericChange('days1st', setDays1st, false)}
                onBlur={() => handleFieldBlur('days1st')}
                placeholder="Enter 1st year days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.days1st && (formTouched || touchedFields.days1st) && (
                <p className="text-xs text-red-500">{fieldErrors.days1st}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>2nd Year Students</label>
              <input
                value={students2nd}
                onChange={handleNumericChange('students2nd', setStudents2nd, false)}
                onBlur={() => handleFieldBlur('students2nd')}
                placeholder="Enter 2nd year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.students2nd && (formTouched || touchedFields.students2nd) && (
                <p className="text-xs text-red-500">{fieldErrors.students2nd}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>2nd Year Days</label>
              <input
                value={days2nd}
                onChange={handleNumericChange('days2nd', setDays2nd, false)}
                onBlur={() => handleFieldBlur('days2nd')}
                placeholder="Enter 2nd year days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.days2nd && (formTouched || touchedFields.days2nd) && (
                <p className="text-xs text-red-500">{fieldErrors.days2nd}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>3rd Year Students</label>
              <input
                value={students3rd}
                onChange={handleNumericChange('students3rd', setStudents3rd, false)}
                onBlur={() => handleFieldBlur('students3rd')}
                placeholder="Enter 3rd year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.students3rd && (formTouched || touchedFields.students3rd) && (
                <p className="text-xs text-red-500">{fieldErrors.students3rd}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>3rd Year Days</label>
              <input
                value={days3rd}
                onChange={handleNumericChange('days3rd', setDays3rd, false)}
                onBlur={() => handleFieldBlur('days3rd')}
                placeholder="Enter 3rd year days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.days3rd && (formTouched || touchedFields.days3rd) && (
                <p className="text-xs text-red-500">{fieldErrors.days3rd}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>4th Year Students</label>
              <input
                value={students4th}
                onChange={handleNumericChange('students4th', setStudents4th, false)}
                onBlur={() => handleFieldBlur('students4th')}
                placeholder="Enter 4th year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.students4th && (formTouched || touchedFields.students4th) && (
                <p className="text-xs text-red-500">{fieldErrors.students4th}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>4th Year Days</label>
              <input
                value={days4th}
                onChange={handleNumericChange('days4th', setDays4th, false)}
                onBlur={() => handleFieldBlur('days4th')}
                placeholder="Enter 4th year days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.days4th && (formTouched || touchedFields.days4th) && (
                <p className="text-xs text-red-500">{fieldErrors.days4th}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Total Students (Computed)</label>
              <input
                type="number"
                value={totalStudents}
                readOnly
                placeholder="Sum of all year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-not-allowed bg-gray-100 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Reduction Days</label>
              <input
                value={reductionDays}
                onChange={handleNumericChange('reductionDays', setReductionDays, false)}
                onBlur={() => handleFieldBlur('reductionDays')}
                placeholder="Enter reduction days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.reductionDays && (formTouched || touchedFields.reductionDays) && (
                <p className="text-xs text-red-500">{fieldErrors.reductionDays}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Veg Extra per Day</label>
              <input
                value={vegExtraPerDay}
                onChange={handleNumericChange('vegExtraPerDay', setVegExtraPerDay)}
                onBlur={() => handleFieldBlur('vegExtraPerDay')}
                placeholder="Enter veg extra per day"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.vegExtraPerDay && (formTouched || touchedFields.vegExtraPerDay) && (
                <p className="text-xs text-red-500">{fieldErrors.vegExtraPerDay}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Non-Veg Extra per Day</label>
              <input
                value={nonVegExtraPerDay}
                onChange={handleNumericChange('nonVegExtraPerDay', setNonVegExtraPerDay)}
                onBlur={() => handleFieldBlur('nonVegExtraPerDay')}
                placeholder="Enter non-veg extra per day"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
              {fieldErrors.nonVegExtraPerDay && (formTouched || touchedFields.nonVegExtraPerDay) && (
                <p className="text-xs text-red-500">{fieldErrors.nonVegExtraPerDay}</p>
              )}
            </div>
          </div>
          <div className="mt-6 pointer-events-auto">
            <Button onClick={handleCalculate} variant="primary" isDarkMode={isDarkMode} className="pointer-events-auto">
              Confirm Calculation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Calculation Results */}
      <Card isDarkMode={isDarkMode}>
        <CardHeader>
          <h3 className="text-lg font-semibold">Live Calculation Results</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-opacity-10 bg-blue-500">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Expenditure</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{totalExpenditure.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-opacity-10 bg-green-500">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Income</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{totalIncome.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-opacity-10 bg-yellow-500">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Net Expenditure</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{netExpenditure.toLocaleString('en-IN', {maximumFractionDigits: 2})}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-opacity-10 bg-purple-500">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Applicable Student-Days</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{applicableStudentDays.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-opacity-10 bg-indigo-500">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mess Fee per Day</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{messFeePerDay.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-opacity-10 bg-teal-500">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Veg Extra per Day</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{vegFeePerDay.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-opacity-10 bg-orange-500">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Non-Veg Extra per Day</p>
              <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{nonVegFeePerDay.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Student Bill Table */}
      <Card isDarkMode={isDarkMode}>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold">Student Bill Table</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Review and send individual bills
              </p>
            </div>
            <div className="flex space-x-2">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className={`px-3 py-2 border rounded-md text-sm cursor-pointer select-all pointer-events-auto ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Years</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="Final">Final Year</option>
              </select>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className={`px-3 py-2 border rounded-md text-sm cursor-pointer select-all pointer-events-auto ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Departments</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BillTable 
            isDarkMode={isDarkMode} 
            students={filteredStudents} 
            vegFeePerDay={vegFeePerDay} 
            nonVegFeePerDay={nonVegFeePerDay}
            messFeePerDay={messFeePerDay}
          />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {calculated && (
        <Card isDarkMode={isDarkMode}>
          <CardHeader>
            <h3 className="text-lg font-semibold">Bulk Actions</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleBulkSendYearDept} variant="primary" isDarkMode={isDarkMode}>
                Send Bill to {yearFilter} Year {departmentFilter} Department
              </Button>
              <Button onClick={handleSendAll} variant="primary" isDarkMode={isDarkMode}>
                Send Bill to All Students
              </Button>
              <Button onClick={handleDownloadExcel} variant="outline" isDarkMode={isDarkMode}>
                Download Excel Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MessBills;
