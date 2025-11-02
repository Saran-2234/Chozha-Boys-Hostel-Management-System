import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import MonthlyCalculations from './MonthlyCalculations';
import CreateMonthlyCalculation from './CreateMonthlyCalculation';
import MessBillsManagement from './MessBillsManagement';

const API_BASE_URL = 'https://finalbackend1.vercel.app';

// Flow steps
const FLOW_STEPS = {
  LANDING: 'landing',
  CREATE_CALCULATION: 'createCalculation',
  VERIFY_CALCULATION: 'verifyCalculation',
  APPLY_REDUCTIONS: 'applyReductions',
  VERIFY_SEND_BILLS: 'verifySendBills',
};

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

const REQUIRED_FIELD_LABELS = {
  selectedMonth: 'Month',
  selectedYear: 'Year',
  groceryCost: 'Grocery Cost',
  vegetableCost: 'Vegetable Cost',
  gasCharges: 'Gas Charges',
  milkLitres: 'Total Milk (litres)',
  milkCostPerLitre: 'Milk Cost per Litre',
  otherCosts: 'Other Costs',
  deductions: 'Income / Deductions',
  students1st: '1st Year Students',
  days1st: '1st Year Days',
  students2nd: '2nd Year Students',
  days2nd: '2nd Year Days',
  students3rd: '3rd Year Students',
  days3rd: '3rd Year Days',
  students4th: '4th Year Students',
  days4th: '4th Year Days',
  vegExtraPerDay: 'Veg Extra per Day',
  nonVegExtraPerDay: 'Non-Veg Extra per Day',
};

const MessBills = ({ isDarkMode }) => {
  const [currentStep, setCurrentStep] = useState(FLOW_STEPS.LANDING);
  const [newCalculationId, setNewCalculationId] = useState(null);
  const [reductionData, setReductionData] = useState([]);

  // Input states
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
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
  const [vegServedDays, setVegServedDays] = useState('');
  const [nonVegServedDays, setNonVegServedDays] = useState('');

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

  // Monthly data states
  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingMonthly, setLoadingMonthly] = useState(false);
  const [monthlyError, setMonthlyError] = useState('');
  const [selectedMonthId, setSelectedMonthId] = useState(null);

  // Filters
  const [yearFilter, setYearFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');



  // Fetch monthly calculations
  const fetchMonthlyCalculations = async () => {
    setLoadingMonthly(true);
    setMonthlyError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/show`, {}, {
        withCredentials: true,
      });
      if (response.data && response.data.data) {
        setMonthlyData(response.data.data);
        // Set default to latest month
        if (response.data.data.length > 0) {
          setSelectedMonthId(response.data.data[0].monthly_base_costs_id);
        }
      }
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch monthly data';
      setMonthlyError(message);
    } finally {
      setLoadingMonthly(false);
    }
  };

  // Get selected month data
  const selectedMonthData = useMemo(() => {
    return monthlyData.find(item => item.monthly_base_costs_id === selectedMonthId) || null;
  }, [monthlyData, selectedMonthId]);

  // Update display values when selected month changes (only for viewing existing calculations)
  useEffect(() => {
    if (selectedMonthData && currentStep !== FLOW_STEPS.CREATE_CALCULATION) {
      // Parse month and year from month_year
      if (selectedMonthData.month_year) {
        const [month, year] = selectedMonthData.month_year.split('-');
        setSelectedMonth(month || '');
        setSelectedYear(year || '');
      }

      setGroceryCost(selectedMonthData.grocery_cost?.toString() || '');
      setVegetableCost(selectedMonthData.vegetable_cost?.toString() || '');
      setGasCharges(selectedMonthData.gas_charges?.toString() || '');
      setMilkLitres(selectedMonthData.total_milk_litres?.toString() || '');
      setMilkCostPerLitre(selectedMonthData.milk_cost_per_litre?.toString() || '');
      setOtherCosts(selectedMonthData.other_costs?.toString() || '');
      setDeductions(selectedMonthData.deductions_income?.toString() || '');
      setVegExtraPerDay(selectedMonthData.veg_extra_per_day?.toString() || '');
      setNonVegExtraPerDay(selectedMonthData.nonveg_extra_per_day?.toString() || '');
      setVegServedDays(selectedMonthData.veg_served_days?.toString() || '');
      setNonVegServedDays(selectedMonthData.nonveg_served_days?.toString() || '');
      setReductionDays(selectedMonthData.reduction_days?.toString() || '');
      setMessFeePerDay(selectedMonthData.mess_fee_per_day || 0);

      // Update year-wise data
      const yearsData = selectedMonthData.years_data || [];
      const year1 = yearsData.find(y => y.year === 1);
      const year2 = yearsData.find(y => y.year === 2);
      const year3 = yearsData.find(y => y.year === 3);
      const year4 = yearsData.find(y => y.year === 4);

      setStudents1st(year1?.total_students?.toString() || '');
      setDays1st(year1?.total_days?.toString() || '');
      setStudents2nd(year2?.total_students?.toString() || '');
      setDays2nd(year2?.total_days?.toString() || '');
      setStudents3rd(year3?.total_students?.toString() || '');
      setDays3rd(year3?.total_days?.toString() || '');
      setStudents4th(year4?.total_students?.toString() || '');
      setDays4th(year4?.total_days?.toString() || '');
    }
  }, [selectedMonthData, currentStep]);

  // Fetch data on component mount
  useEffect(() => {
    fetchMonthlyCalculations();
  }, []);

  // Reset form fields for new calculation
  const resetFormFields = () => {
    setSelectedMonth('');
    setSelectedYear('');
    setGroceryCost('');
    setVegetableCost('');
    setGasCharges('');
    setMilkLitres('');
    setMilkCostPerLitre('');
    setOtherCosts('');
    setDeductions('');
    setStudents1st('');
    setDays1st('');
    setStudents2nd('');
    setDays2nd('');
    setStudents3rd('');
    setDays3rd('');
    setStudents4th('');
    setDays4th('');
    setReductionDays('');
    setVegExtraPerDay('');
    setNonVegExtraPerDay('');
    setVegServedDays('');
    setNonVegServedDays('');
    setFieldErrors({});
    setFormTouched(false);
    setTouchedFields({});
    setCalculated(false);
    setNewCalculationId(null);
  };

  const getFieldValues = () => ({
    selectedMonth,
    selectedYear,
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
    vegServedDays,
    nonVegServedDays,
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

  const buildPayload = () => {
    const yearsData = [
      { year: 1, total_students: parseInt(students1st || 0, 10), total_days: parseInt(days1st || 0, 10) },
      { year: 2, total_students: parseInt(students2nd || 0, 10), total_days: parseInt(days2nd || 0, 10) },
      { year: 3, total_students: parseInt(students3rd || 0, 10), total_days: parseInt(days3rd || 0, 10) },
      { year: 4, total_students: parseInt(students4th || 0, 10), total_days: parseInt(days4th || 0, 10) },
    ];

    const monthYear = selectedMonth && selectedYear ? `${selectedMonth}-${selectedYear}` : '';

    return {
      month_year: monthYear,
      grocery_cost: parseFloat(groceryCost || 0),
      vegetable_cost: parseFloat(vegetableCost || 0),
      gas_charges: parseFloat(gasCharges || 0),
      total_milk_litres: parseFloat(milkLitres || 0),
      milk_cost_per_litre: parseFloat(milkCostPerLitre || 0),
      milk_charges_computed: milkCharges,
      other_costs: parseFloat(otherCosts || 0),
      deductions_income: parseFloat(deductions || 0),
      veg_extra_per_day: parseFloat(vegExtraPerDay || 0),
      nonveg_extra_per_day: parseFloat(nonVegExtraPerDay || 0),
      veg_served_days: parseInt(vegServedDays || 0, 10),
      nonveg_served_days: parseInt(nonVegServedDays || 0, 10),
      total_expenditure: totalExpenditure,
      expenditure_after_income: netExpenditure,
      mess_fee_per_day: messFeePerDay,
      years_data: yearsData,
    };
  };

  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const handleCalculate = () => {
    const errors = validateForm();
    setFormTouched(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setShowConfirmationModal(true);
  };

  const handleConfirmSave = async () => {
    const payload = buildPayload();

    if (!payload.month_year || payload.years_data.some((entry) => !entry.total_students || !entry.total_days)) {
      setApiError('Please ensure all month, year, and year-wise details are filled.');
      return;
    }

    setIsSaving(true);
    setApiError('');
    setApiSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/create`, payload, {
        withCredentials: true,
      });

      setApiSuccess(response.data?.message || 'Monthly calculation saved successfully');
      setShowConfirmationModal(false);
      setCalculated(true);
      setNewCalculationId(response.data?.data?.monthly_base_costs_id);
      setCurrentStep(FLOW_STEPS.VERIFY_CALCULATION);
    } catch (error) {
      const message = error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to save monthly calculation';
      setApiError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmationCancel = () => {
    setShowConfirmationModal(false);
    setApiError('');
    setApiSuccess('');
  };

  const handleBulkSendYearDept = () => {
    console.log(`Send bills to ${yearFilter} year ${departmentFilter} department`);
  };

  const handleSendAll = () => {
    console.log('Send bills to all students');
  };

  const handleDownloadExcel = () => {
    const snapshotData = [
      { field: 'Month', value: selectedMonth || 'N/A' },
      { field: 'Year', value: selectedYear || 'N/A' },
      { field: 'Milk Cost per Litre', value: milkCostPerLitre || '0' },
      { field: 'Veg Served Days', value: vegServedDays || '0' },
      { field: 'Non-Veg Served Days', value: nonVegServedDays || '0' },
      { field: 'Grocery Cost', value: groceryCost || '0' },
      { field: 'Vegetable Cost', value: vegetableCost || '0' },
      { field: 'Gas Charges', value: gasCharges || '0' },
      { field: 'Total Milk (litres)', value: milkLitres || '0' },
      { field: 'Other Costs', value: otherCosts || '0' },
      { field: 'Income / Deductions', value: deductions || '0' },
      { field: 'Veg Extra per Day', value: vegExtraPerDay || '0' },
      { field: 'Non-Veg Extra per Day', value: nonVegExtraPerDay || '0' },
      { field: '1st Year Students', value: students1st || '0' },
      { field: '1st Year Days', value: days1st || '0' },
      { field: '2nd Year Students', value: students2nd || '0' },
      { field: '2nd Year Days', value: days2nd || '0' },
      { field: '3rd Year Students', value: students3rd || '0' },
      { field: '3rd Year Days', value: days3rd || '0' },
      { field: '4th Year Students', value: students4th || '0' },
      { field: '4th Year Days', value: days4th || '0' },
    ];

    const headers = ['Field', 'Value'];
    const csvContent = [
      headers.join(','),
      ...snapshotData.map((item) => [item.field, item.value].join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `monthly_calculation_snapshot_${selectedMonth || 'unknown'}_${selectedYear || 'unknown'}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };





  // Helper function to get days in month
  const getDaysInMonth = (month, year) => {
    const monthNames = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return new Date(year, monthNames[month] + 1, 0).getDate();
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Mess Bills Management
            </h1>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentStep === FLOW_STEPS.LANDING ? 'Create new monthly bills or view existing ones' :
               currentStep === FLOW_STEPS.CREATE_CALCULATION ? 'Create monthly mess bill calculation' :
               currentStep === FLOW_STEPS.VERIFY_CALCULATION ? 'Verify the created calculation' :
               currentStep === FLOW_STEPS.APPLY_REDUCTIONS ? 'Apply reductions for students' :
               'Verify and send bills to students'}
            </p>
          </div>
          {currentStep !== FLOW_STEPS.LANDING && (
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setCurrentStep(FLOW_STEPS.LANDING)}
                variant="outline"
                isDarkMode={isDarkMode}
              >
                Back to Home
              </Button>
            </div>
          )}
        </div>

        {/* Step 1: Landing Page */}
        {currentStep === FLOW_STEPS.LANDING && (
          <div className="space-y-6">
            {/* Students with Applied Reductions Card */}
            {(() => {
              // Get reductions from localStorage (temporary until backend API is ready)
              const appliedReductions = JSON.parse(localStorage.getItem('appliedReductions') || '[]');

              return appliedReductions.length > 0 ? (
                <Card className="p-6" isDarkMode={isDarkMode}>
                  <CardHeader>
                    <div className="space-y-2 text-left">
                      <h2 className="text-xl font-semibold">Students with Applied Reductions</h2>
                      <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        Students who have had mess bill reductions applied ({appliedReductions.length} students)
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {appliedReductions.map((student) => (
                        <div
                          key={student.student_id}
                          className={`rounded-lg border p-4 ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} transition-colors`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {student.student_name}
                              </h3>
                              <Button
                                onClick={() => {
                                  // Navigate to apply reductions step with this student pre-selected
                                  setCurrentStep(FLOW_STEPS.APPLY_REDUCTIONS);
                                }}
                                variant="outline"
                                size="small"
                                isDarkMode={isDarkMode}
                              >
                                Edit
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Reduction Days:
                                </span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {student.reduction_days || 0} days
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Department:
                                </span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {student.department}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Year:
                                </span>
                                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {student.academic_year}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : null;
            })()}

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Mess Bills Management</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Create new monthly bills or view existing ones
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" isDarkMode={isDarkMode} onClick={() => {
                resetFormFields();
                setCurrentStep(FLOW_STEPS.CREATE_CALCULATION);
              }}>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Create New Monthly Mess Bill</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start the process to create a new monthly mess bill calculation
                  </p>
                  <Button variant="primary" isDarkMode={isDarkMode} className="mt-4">
                    Create New Bill
                  </Button>
                </div>
              </Card>
              <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" isDarkMode={isDarkMode} onClick={() => {
                setSelectedMonthId(null);
                fetchMonthlyCalculations();
                setCurrentStep(FLOW_STEPS.VERIFY_CALCULATION);
              }}>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">View Old Mess Bills</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Review and manage existing monthly calculations
                  </p>
                  <Button variant="outline" isDarkMode={isDarkMode} className="mt-4">
                    View Existing Bills
                  </Button>
                </div>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" isDarkMode={isDarkMode} onClick={() => setCurrentStep(FLOW_STEPS.APPLY_REDUCTIONS)}>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Apply Reductions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select students who have applied for mess bill reductions
                  </p>
                  <Button variant="primary" isDarkMode={isDarkMode} className="mt-4">
                    Apply Reductions
                  </Button>
                </div>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" isDarkMode={isDarkMode} onClick={() => setCurrentStep(FLOW_STEPS.VERIFY_SEND_BILLS)}>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Send Bills to Students</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Send calculated mess bills to students with reduction updates applied
                  </p>
                  <Button variant="primary" isDarkMode={isDarkMode} className="mt-4">
                    Send Bills
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Create Monthly Calculation */}
        {currentStep === FLOW_STEPS.CREATE_CALCULATION && (
          <CreateMonthlyCalculation
            isDarkMode={isDarkMode}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            groceryCost={groceryCost}
            setGroceryCost={setGroceryCost}
            vegetableCost={vegetableCost}
            setVegetableCost={setVegetableCost}
            gasCharges={gasCharges}
            setGasCharges={setGasCharges}
            milkLitres={milkLitres}
            setMilkLitres={setMilkLitres}
            milkCostPerLitre={milkCostPerLitre}
            setMilkCostPerLitre={setMilkCostPerLitre}
            otherCosts={otherCosts}
            setOtherCosts={setOtherCosts}
            deductions={deductions}
            setDeductions={setDeductions}
            students1st={students1st}
            setStudents1st={setStudents1st}
            days1st={days1st}
            setDays1st={setDays1st}
            students2nd={students2nd}
            setStudents2nd={setStudents2nd}
            days2nd={days2nd}
            setDays2nd={setDays2nd}
            students3rd={students3rd}
            setStudents3rd={setStudents3rd}
            days3rd={days3rd}
            setDays3rd={setDays3rd}
            students4th={students4th}
            setStudents4th={setStudents4th}
            days4th={days4th}
            setDays4th={setDays4th}
            reductionDays={reductionDays}
            setReductionDays={setReductionDays}
            vegExtraPerDay={vegExtraPerDay}
            setVegExtraPerDay={setVegExtraPerDay}
            nonVegExtraPerDay={nonVegExtraPerDay}
            setNonVegExtraPerDay={setNonVegExtraPerDay}
            vegServedDays={vegServedDays}
            setVegServedDays={setVegServedDays}
            nonVegServedDays={nonVegServedDays}
            setNonVegServedDays={setNonVegServedDays}
            fieldErrors={fieldErrors}
            formTouched={formTouched}
            touchedFields={touchedFields}
            handleFieldBlur={handleFieldBlur}
            handleNumericChange={handleNumericChange}
            handleCalculate={handleCalculate}
            handleDownloadExcel={handleDownloadExcel}
          />
        )}

        {/* Step 3: Verify Monthly Calculation or View Existing Bills */}
        {currentStep === FLOW_STEPS.VERIFY_CALCULATION && (
          <MonthlyCalculations
            isDarkMode={isDarkMode}
            monthlyData={monthlyData}
            loadingMonthly={loadingMonthly}
            monthlyError={monthlyError}
            selectedMonthId={newCalculationId || selectedMonthId}
            setSelectedMonthId={setSelectedMonthId}
            fetchMonthlyCalculations={fetchMonthlyCalculations}
            onEdit={() => {
              // Populate form fields before switching to create step
              if (selectedMonthData) {
                // Parse month and year from month_year
                if (selectedMonthData.month_year) {
                  const [month, year] = selectedMonthData.month_year.split('-');
                  setSelectedMonth(month || '');
                  setSelectedYear(year || '');
                }

                setGroceryCost(selectedMonthData.grocery_cost?.toString() || '');
                setVegetableCost(selectedMonthData.vegetable_cost?.toString() || '');
                setGasCharges(selectedMonthData.gas_charges?.toString() || '');
                setMilkLitres(selectedMonthData.total_milk_litres?.toString() || '');
                setMilkCostPerLitre(selectedMonthData.milk_cost_per_litre?.toString() || '');
                setOtherCosts(selectedMonthData.other_costs?.toString() || '');
                setDeductions(selectedMonthData.deductions_income?.toString() || '');
                setVegExtraPerDay(selectedMonthData.veg_extra_per_day?.toString() || '');
                setNonVegExtraPerDay(selectedMonthData.nonveg_extra_per_day?.toString() || '');
                setVegServedDays(selectedMonthData.veg_served_days?.toString() || '');
                setNonVegServedDays(selectedMonthData.nonveg_served_days?.toString() || '');
                setReductionDays(selectedMonthData.reduction_days?.toString() || '0');
                setMessFeePerDay(selectedMonthData.mess_fee_per_day || 0);

                // Update year-wise data
                const yearsData = selectedMonthData.years_data || [];
                const year1 = yearsData.find(y => y.year === 1);
                const year2 = yearsData.find(y => y.year === 2);
                const year3 = yearsData.find(y => y.year === 3);
                const year4 = yearsData.find(y => y.year === 4);

                setStudents1st(year1?.total_students?.toString() || '');
                setDays1st(year1?.total_days?.toString() || '');
                setStudents2nd(year2?.total_students?.toString() || '');
                setDays2nd(year2?.total_days?.toString() || '');
                setStudents3rd(year3?.total_students?.toString() || '');
                setDays3rd(year3?.total_days?.toString() || '');
                setStudents4th(year4?.total_students?.toString() || '');
                setDays4th(year4?.total_days?.toString() || '');
              }
              setCurrentStep(FLOW_STEPS.CREATE_CALCULATION);
            }}
            onConfirm={() => setCurrentStep(FLOW_STEPS.APPLY_REDUCTIONS)}
            selectedMonthData={selectedMonthData}
            formattedCurrency={formattedCurrency}
            isVerificationStep={!!newCalculationId}
            newCalculationId={newCalculationId}
          />
        )}

        {/* Step 4: Apply Reductions */}
        {currentStep === FLOW_STEPS.APPLY_REDUCTIONS && (
          <MessBillsManagement
            isDarkMode={isDarkMode}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            studentSearch={studentSearch}
            setStudentSearch={setStudentSearch}
            messFeePerDay={messFeePerDay}
            vegFeePerDay={vegFeePerDay}
            nonVegFeePerDay={nonVegFeePerDay}
            calculated={calculated}
            handleBulkSendYearDept={handleBulkSendYearDept}
            handleSendAll={handleSendAll}
            handleDownloadExcel={handleDownloadExcel}
            onNext={() => setCurrentStep(FLOW_STEPS.VERIFY_SEND_BILLS)}
            selectedMonthData={selectedMonthData}
            reductionData={reductionData}
            setReductionData={setReductionData}
            isReductionStep={true}
          />
        )}

        {/* Step 5: Verify and Send Bills */}
        {currentStep === FLOW_STEPS.VERIFY_SEND_BILLS && (
          <MessBillsManagement
            isDarkMode={isDarkMode}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            studentSearch={studentSearch}
            setStudentSearch={setStudentSearch}
            messFeePerDay={messFeePerDay}
            vegFeePerDay={vegFeePerDay}
            nonVegFeePerDay={nonVegFeePerDay}
            calculated={calculated}
            handleBulkSendYearDept={handleBulkSendYearDept}
            handleSendAll={handleSendAll}
            handleDownloadExcel={handleDownloadExcel}
            onBack={() => setCurrentStep(FLOW_STEPS.APPLY_REDUCTIONS)}
            selectedMonthData={selectedMonthData}
            reductionData={reductionData}
            isFinalStep={true}
            getDaysInMonth={getDaysInMonth}
          />
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmationModal}
        onClose={handleConfirmationCancel}
        title="Confirm Calculation"
        isDarkMode={isDarkMode}
      >
        <div className="space-y-4">
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
            Are you sure you want to save this monthly calculation? This action cannot be undone.
          </p>
          {apiError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {apiError}
            </div>
          )}
          {apiSuccess && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              {apiSuccess}
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              onClick={handleConfirmationCancel}
              variant="outline"
              isDarkMode={isDarkMode}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              variant="primary"
              isDarkMode={isDarkMode}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Confirm & Save'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MessBills;
