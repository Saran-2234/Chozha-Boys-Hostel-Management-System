import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import Modal from '../Common/Modal';
import MonthlyCalculations from './MonthlyCalculations';
import CreateMonthlyCalculation from './CreateMonthlyCalculation';
import MessBillsManagement from './MessBillsManagement';

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

const API_BASE_URL = 'https://finalbackend1.vercel.app';

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

  // Update display values when selected month changes
  useEffect(() => {
    if (selectedMonthData) {
      setGroceryCost(selectedMonthData.grocery_cost?.toString() || '');
      setVegetableCost(selectedMonthData.vegetable_cost?.toString() || '');
      setGasCharges(selectedMonthData.gas_charges?.toString() || '');
      setMilkLitres(selectedMonthData.total_milk_litres?.toString() || '');
      setMilkCostPerLitre(selectedMonthData.milk_cost_per_litre?.toString() || '');
      setOtherCosts(selectedMonthData.other_costs?.toString() || '');
      setDeductions(selectedMonthData.deductions_income?.toString() || '');
      setVegExtraPerDay(selectedMonthData.veg_extra_per_day?.toString() || '');
      setNonVegExtraPerDay(selectedMonthData.nonveg_extra_per_day?.toString() || '');
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
  }, [selectedMonthData]);

  // Fetch data on component mount
  useEffect(() => {
    fetchMonthlyCalculations();
  }, []);

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
      setActiveSection('monthlyCalculations');
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
      { field: 'Grocery Cost', value: groceryCost || '0' },
      { field: 'Vegetable Cost', value: vegetableCost || '0' },
      { field: 'Gas Charges', value: gasCharges || '0' },
      { field: 'Total Milk (litres)', value: milkLitres || '0' },
      { field: 'Milk Cost per Litre', value: milkCostPerLitre || '0' },
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
      { field: 'Reduction Days', value: reductionDays || '0' },
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
          <MonthlyCalculations
            isDarkMode={isDarkMode}
            monthlyData={monthlyData}
            loadingMonthly={loadingMonthly}
            monthlyError={monthlyError}
            selectedMonthId={selectedMonthId}
            setSelectedMonthId={setSelectedMonthId}
            fetchMonthlyCalculations={fetchMonthlyCalculations}
            setActiveSection={setActiveSection}
            selectedMonthData={selectedMonthData}
            formattedCurrency={formattedCurrency}
          />
        </section>

        {/* Create Monthly Calculation */}
        <section className={activeSection === 'createCalculation' ? 'space-y-6' : 'hidden'}>
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
            fieldErrors={fieldErrors}
            formTouched={formTouched}
            touchedFields={touchedFields}
            handleFieldBlur={handleFieldBlur}
            handleNumericChange={handleNumericChange}
            handleCalculate={handleCalculate}
            handleDownloadExcel={handleDownloadExcel}
          />
        </section>

        {/* Mess Bills Management */}
        <section className={activeSection === 'messBillsManagement' ? 'space-y-6' : 'hidden'}>
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
            setActiveSection={setActiveSection}
            selectedMonthData={selectedMonthData}
          />
        </section>
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
