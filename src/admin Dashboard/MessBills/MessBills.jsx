import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const MessBills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('new-bill');
  const [formData, setFormData] = useState({
    // Basic Information
    month_year: '',

    // Year-wise Student Data
    years_data: [
      { year: '1', total_students: '', total_days: '' },
      { year: '2', total_students: '', total_days: '' },
      { year: '3', total_students: '', total_days: '' },
      { year: '4', total_students: '', total_days: '' }
    ],

    // Cost Details
    grocery_cost: '',
    vegetable_cost: '',
    gas_charges: '',
    total_milk_litres: '',
    milk_cost_per_litre: '',
    milk_charges_computed: '',
    other_costs: '',
    deductions_income: '',
    veg_extra_per_day: '',
    nonveg_extra_per_day: '',
    veg_served_days: '',
    nonveg_served_days: '',
    reduction_applicable_days: '',

    // Summary
    total_expenditure: '',
    expenditure_after_income: '',
    mess_fee_per_day: ''
  });
  const [billSummary, setBillSummary] = useState(null);
  const [existingBills, setExistingBills] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [filterYear, setFilterYear] = useState('');


  const handleNavClick = (target) => {
    setActiveSection(target);
    if (target === 'existing-bill') {
      fetchExistingBills();
    }
  };

  const formatMonthYear = (monthYearString) => {
    if (!monthYearString) return '';

    const [year, month] = monthYearString.split('-');
    return `${month}-${year}`;
  };

  const validateNumericInput = (name, value) => {
    if (value === '') {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
      return true;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setFieldErrors(prev => ({ ...prev, [name]: 'Please enter a valid number' }));
      return false;
    }

    setFieldErrors(prev => ({ ...prev, [name]: '' }));
    return true;
  };

  const handleNumericInput = (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    const char = e.key;
    if (!/[0-9.]/.test(char) && !allowedKeys.includes(char)) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate numeric inputs
    const numericFields = [
      'grocery_cost', 'vegetable_cost', 'gas_charges', 'total_milk_litres', 'milk_cost_per_litre',
      'other_costs', 'deductions_income', 'veg_extra_per_day', 'nonveg_extra_per_day',
      'veg_served_days', 'nonveg_served_days', 'reduction_applicable_days'
    ];

    if (numericFields.includes(name)) {
      if (!validateNumericInput(name, value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
        return;
      }
    }

    const newFormData = { ...formData, [name]: value };

    // Calculate dependent values
    if (name === 'total_milk_litres' || name === 'milk_cost_per_litre') {
      const totalMilkLitres = parseFloat(newFormData.total_milk_litres) || 0;
      const milkCostPerLitre = parseFloat(newFormData.milk_cost_per_litre) || 0;
      newFormData.milk_charges_computed = (totalMilkLitres * milkCostPerLitre).toFixed(2);
    }

    if (['grocery_cost', 'vegetable_cost', 'gas_charges', 'milk_charges_computed', 'other_costs', 'deductions_income'].includes(name)) {
      const costFields = ['grocery_cost', 'vegetable_cost', 'gas_charges', 'milk_charges_computed', 'other_costs'];
      let total = 0;
      costFields.forEach(field => {
        total += parseFloat(newFormData[field]) || 0;
      });
      newFormData.total_expenditure = total.toFixed(2);

      const deductions = parseFloat(newFormData.deductions_income) || 0;
      newFormData.expenditure_after_income = (total - deductions).toFixed(2);

      calculateMessFee(newFormData);
    }

    if (['reduction_applicable_days'].includes(name)) {
      calculateMessFee(newFormData);
    }

    setFormData(newFormData);
  };

  const calculateMessFee = (formDataToUse) => {
    let totalStudentDays = 0;
    formDataToUse.years_data.forEach(year => {
      const students = parseFloat(year.total_students) || 0;
      const days = parseFloat(year.total_days) || 0;
      totalStudentDays += students * days;
    });

    const reductionDays = parseFloat(formDataToUse.reduction_applicable_days) || 0;
    const applicableStudentDays = totalStudentDays - reductionDays;
    const netExpenditure = parseFloat(formDataToUse.expenditure_after_income) || 0;

    if (applicableStudentDays > 0 && netExpenditure > 0) {
      const messFeePerDay = netExpenditure / applicableStudentDays;
      formDataToUse.mess_fee_per_day = Math.round(messFeePerDay).toString();
    } else {
      formDataToUse.mess_fee_per_day = '0';
    }
  };

  const handleYearChange = (index, e) => {
    const { name, value } = e.target;
    const maxLengths = { year: 1, total_students: 3, total_days: 2 };
    const maxLength = maxLengths[name] || 999;

    if (value.length > maxLength) {
      return;
    }

    const newYears = [...formData.years_data];
    newYears[index][name] = value;

    const updatedFormData = { ...formData, years_data: newYears };

    calculateMessFee(updatedFormData);

    setFormData(updatedFormData);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate that expenditure after income is positive
    const netExpenditure = parseFloat(formData.expenditure_after_income) || 0;
    if (netExpenditure <= 0) {
      setError('Expenditure after income must be greater than zero. Please check your deductions/income amount.');
      setLoading(false);
      return;
    }

    // Validate that mess fee per day is calculated
    if (!formData.mess_fee_per_day || parseFloat(formData.mess_fee_per_day) <= 0) {
      setError('Mess fee per day must be greater than zero. Please check your inputs.');
      setLoading(false);
      return;
    }

    try {
      // Prepare the request body matching the API format
      const requestBody = {
        month_year: formatMonthYear(formData.month_year),
        grocery_cost: parseFloat(formData.grocery_cost) || 0,
        vegetable_cost: parseFloat(formData.vegetable_cost) || 0,
        gas_charges: parseFloat(formData.gas_charges) || 0,
        total_milk_litres: parseFloat(formData.total_milk_litres) || 0,
        milk_cost_per_litre: parseFloat(formData.milk_cost_per_litre) || 0,
        milk_charges_computed: parseFloat(formData.milk_charges_computed) || 0,
        other_costs: parseFloat(formData.other_costs) || 0,
        deductions_income: parseFloat(formData.deductions_income) || 0,
        veg_extra_per_day: parseFloat(formData.veg_extra_per_day) || 0,
        nonveg_extra_per_day: parseFloat(formData.nonveg_extra_per_day) || 0,
        total_expenditure: parseFloat(formData.total_expenditure) || 0,
        expenditure_after_income: parseFloat(formData.expenditure_after_income) || 0,
        mess_fee_per_day: parseFloat(formData.mess_fee_per_day) || 0,
        veg_served_days: parseFloat(formData.veg_served_days) || 0,
        nonveg_served_days: parseFloat(formData.nonveg_served_days) || 0,
        reduction_applicable_days: parseFloat(formData.reduction_applicable_days) || 0,
        years_data: formData.years_data.map(year => ({
          year: parseInt(year.year) || 0,
          total_students: parseInt(year.total_students) || 0,
          total_days: parseInt(year.total_days) || 0
        }))
      };

      const response = await axios.post('https://finalbackend1.vercel.app/admin/create', requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      setSuccess(response.data.message);
      setBillSummary({
        message: response.data.message,
        base_id: response.data.base_id,
        year_data_inserted: response.data.year_data_inserted
      });

    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'An error occurred while creating the monthly calculation.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingBills = async (year = filterYear) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const requestBody = year ? { year } : {};

      const response = await axios.post(
        'https://finalbackend1.vercel.app/admin/show',
        requestBody,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response.data && response.data.data) {
        const transformedMonths = response.data.data.map(item => {
          const totalStudents = item.years_data.reduce((sum, year) => sum + year.total_students, 0);
          const totalDays = item.years_data.reduce((sum, year) => sum + year.total_days, 0) / item.years_data.length;

          const createdDate = new Date(item.created_at);
          const formattedDate = createdDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return {
            title: item.month_year,
            date: `Created: ${formattedDate}`,
            totalBills: totalStudents,
            totalAmount: parseFloat(item.expenditure_after_income) || 0,
            baseId: item.monthly_base_costs_id,
            costs: [
              { label: 'Grocery Cost', value: parseFloat(item.grocery_cost) || 0 },
              { label: 'Vegetable Cost', value: parseFloat(item.vegetable_cost) || 0 },
              { label: 'Gas Charges', value: parseFloat(item.gas_charges) || 0 },
              { label: 'Milk Charges', value: parseFloat(item.milk_charges_computed) || 0 },
              { label: 'Other Costs', value: parseFloat(item.other_costs) || 0 },
              { label: 'Total Expenditure', value: parseFloat(item.total_expenditure) || 0 },
              { label: 'Deductions/Income', value: parseFloat(item.deductions_income) || 0 },
              { label: 'Net Expenditure', value: parseFloat(item.expenditure_after_income) || 0 },
              { label: 'Mess Fee Per Day', value: parseFloat(item.mess_fee_per_day) || 0 },
              { label: 'Veg Extra Per Day', value: parseFloat(item.veg_extra_per_day) || 0 },
              { label: 'Non-Veg Extra Per Day', value: parseFloat(item.nonveg_extra_per_day) || 0 },
              { label: 'Status', value: item.progress_stage }
            ],
            departments: item.years_data.map(year => ({
              name: `Year ${year.year}`,
              bills: parseInt(year.total_students) || 0,
              amount: (parseInt(year.total_students) || 0) * (parseFloat(item.mess_fee_per_day) || 0)
            })),
            yearDetails: item.years_data,
            messData: item
          };
        });

        setExistingBills({ months: transformedMonths });
        setSuccess(response.data.message || 'Existing mess bills data loaded successfully!');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Failed to fetch existing bills.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };



  const resetForm = () => {
    setFormData({
      month_year: '',
      years_data: [
        { year: '1', total_students: '', total_days: '' },
        { year: '2', total_students: '', total_days: '' },
        { year: '3', total_students: '', total_days: '' },
        { year: '4', total_students: '', total_days: '' }
      ],
      grocery_cost: '',
      vegetable_cost: '',
      gas_charges: '',
      total_milk_litres: '',
      milk_cost_per_litre: '',
      milk_charges_computed: '',
      other_costs: '',
      deductions_income: '',
      veg_extra_per_day: '',
      nonveg_extra_per_day: '',
      veg_served_days: '',
      nonveg_served_days: '',
      reduction_applicable_days: '',
      total_expenditure: '',
      expenditure_after_income: '',
      mess_fee_per_day: ''
    });
    setBillSummary(null);
    setError('');
    setSuccess('');
    setFieldErrors({});
  };

  return (
    <div className="container">


      <div className="navigation">
        <button className={`nav-btn ${activeSection === 'new-bill' ? 'active' : ''}`} onClick={() => handleNavClick('new-bill')}>New Mess Bill</button>
        <button className={`nav-btn ${activeSection === 'existing-bill' ? 'active' : ''}`} onClick={() => handleNavClick('existing-bill')}>Existing Mess Bills</button>
      </div>

      <section id="new-bill" className={`content-section ${activeSection === 'new-bill' ? 'active' : ''}`}>
        <h2>Create Monthly Calculation</h2>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {success && (
          <div className="success">
            {success}
          </div>
        )}

        <form id="bill-form" onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="form-section">
            <div className="form-section-title">Basic Information</div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="month_year">Month-Year *</label>
                <input
                  type="month"
                  id="month_year"
                  name="month_year"
                  value={formData.month_year}
                  onChange={handleInputChange}
                  required
                />
                {fieldErrors.month_year && <span className="error-message">{fieldErrors.month_year}</span>}
              </div>
            </div>
          </div>

          {/* Year-wise Student Data Section */}
          <div className="form-section">
            <div className="form-section-title">Year-wise Student Data</div>
            {formData.years_data.map((year, index) => (
              <div key={index} className="year-entry" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor={`year-${index}`}>Year</label>
                    <input
                      id={`year-${index}`}
                      name="year"
                      value={year.year}
                      readOnly
                      style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`total_students-${index}`}>Total Students</label>
                    <input
                      id={`total_students-${index}`}
                      name="total_students"
                      placeholder="Number of students"
                      value={year.total_students}
                      onChange={(e) => handleYearChange(index, e)}
                      onKeyDown={handleNumericInput}
                      maxLength="3"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor={`total_days-${index}`}>Total Days</label>
                    <input
                      id={`total_days-${index}`}
                      name="total_days"
                      placeholder="Number of days"
                      value={year.total_days}
                      onChange={(e) => handleYearChange(index, e)}
                      onKeyDown={handleNumericInput}
                      maxLength="2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Details Section */}
          <div className="form-section">
            <div className="form-section-title">Cost Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="grocery_cost">Grocery Cost *</label>
                <input
                  id="grocery_cost"
                  name="grocery_cost"
                  value={formData.grocery_cost}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                  required
                />
                {fieldErrors.grocery_cost && <span className="error-message">{fieldErrors.grocery_cost}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="vegetable_cost">Vegetable Cost *</label>
                <input
                  id="vegetable_cost"
                  name="vegetable_cost"
                  value={formData.vegetable_cost}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                  required
                />
                {fieldErrors.vegetable_cost && <span className="error-message">{fieldErrors.vegetable_cost}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="gas_charges">Gas Charges *</label>
                <input
                  id="gas_charges"
                  name="gas_charges"
                  value={formData.gas_charges}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                  required
                />
                {fieldErrors.gas_charges && <span className="error-message">{fieldErrors.gas_charges}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="total_milk_litres">Total Milk Litres</label>
                <input
                  id="total_milk_litres"
                  name="total_milk_litres"
                  value={formData.total_milk_litres}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.total_milk_litres && <span className="error-message">{fieldErrors.total_milk_litres}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="milk_cost_per_litre">Milk Cost Per Litre</label>
                <input
                  id="milk_cost_per_litre"
                  name="milk_cost_per_litre"
                  value={formData.milk_cost_per_litre}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.milk_cost_per_litre && <span className="error-message">{fieldErrors.milk_cost_per_litre}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="milk_charges_computed">Milk Charges Computed</label>
                <input
                  type="number"
                  step="0.01"
                  id="milk_charges_computed"
                  name="milk_charges_computed"
                  value={formData.milk_charges_computed}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="other_costs">Other Costs</label>
                <input
                  id="other_costs"
                  name="other_costs"
                  value={formData.other_costs}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.other_costs && <span className="error-message">{fieldErrors.other_costs}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="deductions_income">Deductions/Income</label>
                <input
                  id="deductions_income"
                  name="deductions_income"
                  value={formData.deductions_income}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.deductions_income && <span className="error-message">{fieldErrors.deductions_income}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="veg_extra_per_day">Veg Extra Per Day</label>
                <input
                  id="veg_extra_per_day"
                  name="veg_extra_per_day"
                  value={formData.veg_extra_per_day}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.veg_extra_per_day && <span className="error-message">{fieldErrors.veg_extra_per_day}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="nonveg_extra_per_day">Non-Veg Extra Per Day</label>
                <input
                  id="nonveg_extra_per_day"
                  name="nonveg_extra_per_day"
                  value={formData.nonveg_extra_per_day}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.nonveg_extra_per_day && <span className="error-message">{fieldErrors.nonveg_extra_per_day}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="veg_served_days">Veg Served Days</label>
                <input
                  id="veg_served_days"
                  name="veg_served_days"
                  value={formData.veg_served_days}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.veg_served_days && <span className="error-message">{fieldErrors.veg_served_days}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="nonveg_served_days">Non-Veg Served Days</label>
                <input
                  id="nonveg_served_days"
                  name="nonveg_served_days"
                  value={formData.nonveg_served_days}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.nonveg_served_days && <span className="error-message">{fieldErrors.nonveg_served_days}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="reduction_applicable_days">Reduction Applicable Days</label>
                <input
                  id="reduction_applicable_days"
                  name="reduction_applicable_days"
                  value={formData.reduction_applicable_days}
                  onChange={handleInputChange}
                  onKeyDown={handleNumericInput}
                />
                {fieldErrors.reduction_applicable_days && <span className="error-message">{fieldErrors.reduction_applicable_days}</span>}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="form-section">
            <div className="form-section-title">Summary</div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="total_expenditure">Total Expenditure</label>
                <input
                  id="total_expenditure"
                  name="total_expenditure"
                  value={formData.total_expenditure}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="expenditure_after_income">Expenditure After Income</label>
                <input
                  type="number"
                  step="0.01"
                  id="expenditure_after_income"
                  name="expenditure_after_income"
                  value={formData.expenditure_after_income}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="mess_fee_per_day">Mess Fee Per Day *</label>
                <input
                  type="number"
                  step="0.01"
                  id="mess_fee_per_day"
                  name="mess_fee_per_day"
                  value={formData.mess_fee_per_day}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-reset" onClick={resetForm}>Reset Form</button>
            <button type="submit" className="btn btn-search" disabled={loading}>
              {loading ? 'Saving...' : 'Save Monthly Bill'}
            </button>
          </div>
        </form>


      </section>

      <section id="existing-bill" className={`content-section ${activeSection === 'existing-bill' ? 'active' : ''}`}>
        <div className="controls">
          <h2>Existing Mess Bills</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label htmlFor="yearFilter" style={{ fontWeight: '500' }}>Filter by Year:</label>
              <input
                id="yearFilter"
                type="text"
                placeholder="e.g., 2025"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', width: '120px' }}
              />
            </div>
            <button id="fetchData" className="btn" onClick={() => fetchExistingBills(filterYear)}>Search</button>
            <button
              className="btn"
              onClick={() => {
                setFilterYear('');
                fetchExistingBills('');
              }}
              style={{ marginLeft: '5px' }}
            >
              Clear Filter
            </button>
          </div>
        </div>

        {loading && (
          <div id="loadingMonthly" className="loading">
            <p>Loading existing mess bills data...</p>
            <div>
              <div style={{ display: 'inline-block', width: '20px', height: '20px', border: '3px solid #f3f3f3', borderTop: '3px solid #4a6cf7', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
          </div>
        )}

        {error && (
          <div id="errorMonthly" className="error">
            {error}
          </div>
        )}

        {success && (
          <div id="successMonthly" className="success">
            {success}
          </div>
        )}

        {existingBills && (
          <div id="dataContainer">
            {existingBills.months.map((month, index) => (
              <div key={index} className="month-card" onClick={() => { sessionStorage.setItem('monthData', JSON.stringify(month)); navigate('/mess-bills-detail'); }}>
                <div className="month-header" style={{ cursor: 'pointer' }}>
                  <div>
                    <div className="month-title">{month.title}</div>
                    <div className="month-date">{month.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Bills: {month.totalBills}</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Amount: ₹{month.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer>
        <p>Mess Bill Management System &copy; 2023</p>
      </footer>

      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          body {
            background-color: #f5f7fa;
            color: #333;
            line-height: 1.6;
          }

          .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
          }

          header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
          }

          .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
          }

          .navigation {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            overflow: hidden;
          }

          .nav-btn {
            flex: 1;
            padding: 15px 20px;
            text-align: center;
            background: none;
            border: none;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .nav-btn.active {
            background: #2575fc;
            color: white;
          }

          .nav-btn:hover:not(.active) {
            background: #f0f5ff;
          }

          .content-section {
            display: none;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            margin-bottom: 30px;
          }

          .content-section.active {
            display: block;
            animation: fadeIn 0.5s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          h2 {
            color: #2575fc;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f5ff;
          }

          .form-section {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: 8px;
            background: #f8f9fa;
          }

          .form-section-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #4a6cf7;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e9ecef;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .form-group {
            margin-bottom: 15px;
          }

          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #333;
          }

          input, select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.3s ease;
          }

          input:focus, select:focus {
            outline: none;
            border-color: #4a6cf7;
            box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
          }

          input[readonly] {
            background-color: #f8f9fa;
            cursor: not-allowed;
          }

          .checkbox-group {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 10px;
          }

          .checkbox-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .checkbox-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
          }

          .btn {
            background: #4a6cf7;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .btn:hover {
            background: #3a5ce5;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .btn-reset {
            background: #6c757d;
          }

          .btn-reset:hover {
            background: #5a6268;
          }

          .btn-search {
            background: #28a745;
          }

          .btn-search:hover {
            background: #218838;
          }

          .form-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
          }

          .bill-summary {
            background: #f8faff;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #2575fc;
          }

          .bill-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }

          .bill-total {
            font-weight: bold;
            font-size: 1.2rem;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #ddd;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }

          th {
            background-color: #f8faff;
            font-weight: 600;
          }

          tr:hover {
            background-color: #f8faff;
          }

          .status-paid {
            color: #28a745;
            font-weight: 600;
          }

          .status-pending {
            color: #ffc107;
            font-weight: 600;
          }

          .action-btn {
            background: none;
            border: none;
            color: #2575fc;
            cursor: pointer;
            font-weight: 600;
          }

          footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #666;
            font-size: 0.9rem;
          }

          .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .loading {
            text-align: center;
            padding: 30px;
            color: #666;
          }

          .error {
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #dc3545;
          }

          .success {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #28a745;
          }

          .month-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            margin-bottom: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .month-card:hover {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          }



          .month-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: linear-gradient(135deg, #f8faff 0%, #e8f2ff 100%);
            border-radius: 10px 10px 0 0;
          }

          .month-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #2575fc;
            margin-bottom: 5px;
          }

          .month-date {
            font-size: 0.9rem;
            opacity: 0.7;
          }



          .costs-table {
            margin-bottom: 30px;
          }

          .cost-value {
            font-weight: 600;
            color: #2575fc;
          }

          .years-section {
            margin-bottom: 20px;
          }

          .years-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
          }

          .year-card {
            background: #f8faff;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #2575fc;
          }

          .year-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #2575fc;
          }

          .year-stats {
            display: flex;
            justify-content: space-between;
          }

          .stat {
            text-align: center;
          }

          .stat-value {
            font-size: 1.2rem;
            font-weight: 600;
            color: #333;
            display: block;
          }

          .stat-label {
            font-size: 0.8rem;
            opacity: 0.7;
            margin-top: 2px;
          }

          .btn-show-bills, .btn-hide-bills {
            background: #2575fc;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            margin-right: 10px;
            transition: all 0.3s ease;
          }

          .btn-show-bills:hover, .btn-hide-bills:hover {
            background: #1a5ce5;
          }

          .individual-bills {
            margin-top: 20px;
            display: none;
          }

          .individual-bills.active {
            display: block;
          }

          .bill-card {
            background: #f8faff;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #2575fc;
          }

          .bill-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .bill-card-title {
            font-weight: 600;
            color: #333;
          }

          .bill-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
          }

          .bill-status.verified {
            background: #d4edda;
            color: #155724;
          }

          .bill-status.pending {
            background: #fff3cd;
            color: #856404;
          }

          .bill-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 15px;
          }

          .bill-detail {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }

          .bill-detail-label {
            font-weight: 600;
            color: #666;
          }

          .bill-detail-value {
            font-weight: 600;
            color: #333;
          }

          .bill-actions {
            display: flex;
            gap: 10px;
          }

          .btn-verify {
            background: #28a745;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-verify:hover:not(.disabled) {
            background: #218838;
          }

          .btn-verify.disabled {
            background: #6c757d;
            cursor: not-allowed;
          }

          .btn-download {
            background: #6c757d;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
            transition: all 0.3s ease;
          }

          .btn-download:hover {
            background: #5a6268;
          }

          @media (max-width: 768px) {
            .container {
              padding: 10px;
            }

            .form-grid {
              grid-template-columns: 1fr;
            }

            .navigation {
              flex-direction: column;
            }

            .month-header {
              flex-direction: column;
              text-align: center;
            }

            .bill-details {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </div>
  );
};

export default MessBills;