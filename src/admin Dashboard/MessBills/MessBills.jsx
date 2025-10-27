import React, { useState, useEffect, useMemo } from 'react';
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

const NAV_ITEMS = [
  {
    id: 'monthlyCalculations',
    label: 'Monthly Calculations',
    subtitle: 'View live totals & year wise breakdown',
  },
  {
    id: 'createCalculation',
    label: 'Create Monthly Calculation',
    subtitle: 'Update expenses, attendance & confirm totals',
  },
  {
    id: 'messBillsManagement',
    label: 'Mess Bills Management',
    subtitle: 'Filter and manage individual student bills',
  },
];

const sanitizeNumericInput = (value, allowDecimal = true) => {
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
  const [activeSection, setActiveSection] = useState('monthlyCalculations');

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
  const [studentSearch, setStudentSearch] = useState('');

  // Mock students data
  const mockStudents = useMemo(
    () => [
      { id: 'ST001', name: 'John Doe', year: '1st', department: 'CSE', daysPresent: 28, vegDays: 28, nonVegDays: 0 },
      { id: 'ST002', name: 'Jane Smith', year: '2nd', department: 'ECE', daysPresent: 25, vegDays: 25, nonVegDays: 0 },
      { id: 'ST003', name: 'Bob Johnson', year: '3rd', department: 'MECH', daysPresent: 28, vegDays: 20, nonVegDays: 8 },
      { id: 'ST004', name: 'Priya Singh', year: 'Final', department: 'CSE', daysPresent: 27, vegDays: 22, nonVegDays: 5 },
      { id: 'ST005', name: 'Arjun Patel', year: '1st', department: 'ECE', daysPresent: 26, vegDays: 18, nonVegDays: 8 },
    ],
    []
  );

  const filteredStudents = useMemo(() => {
    const search = studentSearch.trim().toLowerCase();

    return mockStudents.filter((student) => {
      const matchesYear = yearFilter === 'all' || student.year === yearFilter;
      const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
      const matchesSearch =
        search.length === 0 ||
        student.name.toLowerCase().includes(search) ||
        student.id.toLowerCase().includes(search);
      return matchesYear && matchesDepartment && matchesSearch;
    });
  }, [mockStudents, yearFilter, departmentFilter, studentSearch]);

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

  useEffect(() => {
    const grocery = parseFloat(groceryCost || 0);
    const vegetable = parseFloat(vegetableCost || 0);
    const gas = parseFloat(gasCharges || 0);
    const milk = parseFloat(milkLitres || 0) * parseFloat(milkCostPerLitre || 0);
    const other = parseFloat(otherCosts || 0);
    const income = parseFloat(deductions || 0);
    const students1 = parseInt(students1st || 0, 10);
    const days1 = parseInt(days1st || 0, 10);
    const students2 = parseInt(students2nd || 0, 10);
    const days2 = parseInt(days2nd || 0, 10);
    const students3 = parseInt(students3rd || 0, 10);
    const days3 = parseInt(days3rd || 0, 10);
    const students4 = parseInt(students4th || 0, 10);
    const days4 = parseInt(days4th || 0, 10);
    const reduction = parseInt(reductionDays || 0, 10);
    const vegExtra = parseFloat(vegExtraPerDay || 0);
    const nonVegExtra = parseFloat(nonVegExtraPerDay || 0);

    setMilkCharges(milk);

    const totalStudentsComputed = students1 + students2 + students3 + students4;
    setTotalStudents(totalStudentsComputed);

    const totalPossible = students1 * days1 + students2 * days2 + students3 * days3 + students4 * days4;
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
  }, [
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
  ]);

  const formattedCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount || 0);

  const validateForm = () => {
    const errors = {};

    Object.entries(REQUIRED_FIELD_LABELS).forEach(([key, label]) => {
      const inputValue = getFieldValues()[key];

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
    setActiveSection('monthlyCalculations');
  };

  const handleBulkSendYearDept = () => {
    console.log(`Send bills to ${yearFilter} year ${departmentFilter} department`);
  };

  const handleSendAll = () => {
    console.log('Send bills to all students');
  };

  const handleDownloadExcel = () => {
    const dataStr =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(
        'Student ID,Student Name,Days Present,Mess Fee per Day,Mess Charges,Veg Days,Non-Veg Days,Total\n' +
          mockStudents
            .map((s) => {
              const messCharges = s.daysPresent * messFeePerDay;
              const total = messCharges + s.vegDays * vegFeePerDay + s.nonVegDays * nonVegFeePerDay;
              return `${s.id},${s.name},${s.daysPresent},${messFeePerDay},${messCharges},${s.vegDays},${s.nonVegDays},${total}`;
            })
            .join('\n')
      );

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'mess_bills.csv');
    downloadAnchor.click();
  };

  const sectionCardClass = 'space-y-6';

  const inputClass = `w-full rounded-md border px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 ${
    isDarkMode
      ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
  }`;

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Mess Management
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Review monthly calculations and manage student bills.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setActiveSection('createCalculation')}
              variant="primary"
              isDarkMode={isDarkMode}
            >
              Update Monthly Inputs
            </Button>
          </div>
        </div>

        <nav
          className={`flex flex-wrap items-center justify-center gap-3 rounded-lg border p-3 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`flex min-w-[200px] flex-col items-center rounded-md border px-4 py-3 text-center transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-blue-400 hover:text-white'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.subtitle}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Monthly Calculations (Live View) */}
        <section className={activeSection === 'monthlyCalculations' ? 'space-y-6' : 'hidden'}>
          <Card className={sectionCardClass} isDarkMode={isDarkMode}>
            <CardHeader>
              <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Live Monthly Summary</h2>
                  <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    Review aggregated totals using the most recent calculation inputs.
                  </p>
                </div>
                <Button
                  onClick={() => setActiveSection('createCalculation')}
                  variant="primary"
                  isDarkMode={isDarkMode}
                  className="shadow-md"
                >
                  Update Calculation Inputs
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[{
                  label: 'Total Expenditure',
                  value: formattedCurrency(totalExpenditure),
                  tone: 'from-indigo-500/90 via-indigo-500/70 to-indigo-600/80',
                },
                {
                  label: 'Total Income',
                  value: formattedCurrency(totalIncome),
                  tone: 'from-emerald-500/90 via-emerald-500/70 to-emerald-600/80',
                },
                {
                  label: 'Net Expenditure',
                  value: formattedCurrency(netExpenditure),
                  tone: 'from-amber-500/90 via-amber-500/70 to-amber-600/80',
                },
                {
                  label: 'Applicable Student Days',
                  value: applicableStudentDays.toLocaleString(),
                  tone: 'from-purple-500/90 via-purple-500/70 to-purple-600/80',
                },
                {
                  label: 'Mess Fee / Day',
                  value: formattedCurrency(messFeePerDay),
                  tone: 'from-sky-500/90 via-sky-500/70 to-sky-600/80',
                },
                {
                  label: 'Total Students',
                  value: totalStudents.toLocaleString(),
                  tone: 'from-rose-500/90 via-rose-500/70 to-rose-600/80',
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
                    Inspect the individual cost components contributing to this months mess bill.
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
                        value: formattedCurrency(parseFloat(groceryCost || 0)),
                        note: 'Staple supplies & dry provisions',
                      },
                      {
                        label: 'Vegetable Cost',
                        value: formattedCurrency(parseFloat(vegetableCost || 0)),
                        note: 'Fresh produce & leafy greens',
                      },
                      {
                        label: 'Gas Charges',
                        value: formattedCurrency(parseFloat(gasCharges || 0)),
                        note: 'Cooking fuel usage',
                      },
                      {
                        label: 'Milk Charges',
                        value: formattedCurrency(milkCharges),
                        note: 'Total litres  d cost per litre',
                      },
                      {
                        label: 'Other Costs',
                        value: formattedCurrency(parseFloat(otherCosts || 0)),
                        note: 'Maintenance, supplies & contingencies',
                      },
                      {
                        label: 'Income / Deductions',
                        value: formattedCurrency(parseFloat(deductions || 0)),
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
                  {[{
                    title: '1st Year',
                    students: parseInt(students1st || 0, 10),
                    days: parseInt(days1st || 0, 10),
                  },
                  {
                    title: '2nd Year',
                    students: parseInt(students2nd || 0, 10),
                    days: parseInt(days2nd || 0, 10),
                  },
                  {
                    title: '3rd Year',
                    students: parseInt(students3rd || 0, 10),
                    days: parseInt(days3rd || 0, 10),
                  },
                  {
                    title: '4th Year',
                    students: parseInt(students4th || 0, 10),
                    days: parseInt(days4th || 0, 10),
                  }].map((year) => (
                    <div
                      key={year.title}
                      className={`rounded-xl border p-4 transition ${
                        isDarkMode ? 'border-slate-700 bg-slate-900/80' : 'border-indigo-100 bg-indigo-50/70'
                      }`}
                    >
                      <p className="text-sm font-semibold text-indigo-500">{year.title}</p>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">Students</p>
                          <p className="text-xl font-bold">{year.students}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs uppercase tracking-wide text-slate-400">Days</p>
                          <p className="text-xl font-bold">{year.days}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Create Monthly Calculation */}
        <section className={activeSection === 'createCalculation' ? 'space-y-6' : 'hidden'}>
          <Card className={sectionCardClass} isDarkMode={isDarkMode}>
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
                    <h3 className="text-lg font-semibold">Cost Details</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </section>

        {/* Mess Bills Management */}
        <section className={activeSection === 'messBillsManagement' ? 'space-y-6' : 'hidden'}>
          <Card className={sectionCardClass} isDarkMode={isDarkMode}>
            <CardHeader>
              <div className="space-y-2 text-left">
                <h2 className="text-xl font-semibold">Mess Bills Management</h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                  Filter bills department-wise or per academic year, apply manual reductions, and dispatch bills to
                  students.
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="rounded-2xl border p-6 shadow-lg">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Search & Filter</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Narrow down student bills by academic year, department or registration number.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => {
                        setYearFilter('all');
                        setDepartmentFilter('all');
                        setStudentSearch('');
                      }}
                      variant="outline"
                      isDarkMode={isDarkMode}
                    >
                      Reset Filters
                    </Button>
                    <Button
                      onClick={() => setActiveSection('createCalculation')}
                      variant="primary"
                      isDarkMode={isDarkMode}
                    >
                      Update Monthly Inputs
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Academic Year</label>
                    <select
                      value={yearFilter}
                      onChange={(event) => setYearFilter(event.target.value)}
                      className={inputClass}
                    >
                      <option value="all">All Years</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="Final">Final Year</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <select
                      value={departmentFilter}
                      onChange={(event) => setDepartmentFilter(event.target.value)}
                      className={inputClass}
                    >
                      <option value="all">All Departments</option>
                      <option value="CSE">Computer Science</option>
                      <option value="ECE">Electronics</option>
                      <option value="MECH">Mechanical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registration / Name</label>
                    <input
                      value={studentSearch}
                      onChange={(event) => setStudentSearch(event.target.value)}
                      placeholder="Search student"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mess Fee / Day</label>
                    <input value={messFeePerDay} disabled className={`${inputClass} opacity-70`} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border p-6 shadow-lg">
                <div className="flex flex-col gap-4 border-b pb-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Filtered Results</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Showing {filteredStudents.length} of {mockStudents.length} students
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleBulkSendYearDept}
                      variant="primary"
                      isDarkMode={isDarkMode}
                      disabled={filteredStudents.length === 0}
                    >
                      Send to Filtered Group
                    </Button>
                    <Button onClick={handleSendAll} variant="outline" isDarkMode={isDarkMode}>
                      Send to All Students
                    </Button>
                    <Button onClick={handleDownloadExcel} variant="outline" isDarkMode={isDarkMode}>
                      Export to CSV
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <BillTable
                    isDarkMode={isDarkMode}
                    students={filteredStudents}
                    vegFeePerDay={vegFeePerDay}
                    nonVegFeePerDay={nonVegFeePerDay}
                    messFeePerDay={messFeePerDay}
                  />
                </div>
              </div>

              {calculated && (
                <div className="rounded-2xl border p-6 text-center shadow-lg">
                  <h3 className="text-lg font-semibold">Bulk Actions</h3>
                  <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    The monthly calculation is confirmed. You can now dispatch bills to students.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button onClick={handleBulkSendYearDept} variant="primary" isDarkMode={isDarkMode}>
                      Send Bills to Filtered Students
                    </Button>
                    <Button onClick={handleSendAll} variant="outline" isDarkMode={isDarkMode}>
                      Send Bills to Everyone
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default MessBills;