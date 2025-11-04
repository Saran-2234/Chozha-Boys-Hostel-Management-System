import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MessBills = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('new-bill');
  const [formData, setFormData] = useState({
    // Basic Information
    month_year: '',
    years: [1, 2, 3, 4], // Default all years selected

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

    // Summary
    total_expenditure: '',
    expenditure_after_income: '',
    mess_fee_per_day: '',

    // Year-wise Data
    first_year_students: '',
    first_year_days: '',
    second_year_students: '',
    second_year_days: '',
    third_year_students: '',
    third_year_days: '',
    fourth_year_students: '',
    fourth_year_days: ''
  });
  const [billSummary, setBillSummary] = useState(null);
  const [existingBills, setExistingBills] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedCards, setExpandedCards] = useState({});
  const [shownBills, setShownBills] = useState({});

  const handleNavClick = (target) => {
    setActiveSection(target);
    if (target === 'existing-bill') {
      fetchExistingBills();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'years') {
        setFormData(prev => ({
          ...prev,
          years: checked
            ? [...prev.years, parseInt(value)]
            : prev.years.filter(year => year !== parseInt(value))
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Auto-calculations
      setTimeout(() => {
        if (name === 'total_milk_litres' || name === 'milk_cost_per_litre') {
          calculateMilkCharges();
        }
        if (['grocery_cost', 'vegetable_cost', 'gas_charges', 'milk_charges_computed', 'other_costs'].includes(name)) {
          calculateTotalExpenditure();
        }
        if (name === 'deductions_income') {
          calculateExpenditureAfterIncome();
        }
      }, 0);
    }
  };

  const calculateMilkCharges = () => {
    const totalMilkLitres = parseFloat(formData.total_milk_litres) || 0;
    const milkCostPerLitre = parseFloat(formData.milk_cost_per_litre) || 0;

    if (totalMilkLitres > 0 && milkCostPerLitre > 0) {
      const milkCharges = totalMilkLitres * milkCostPerLitre;
      setFormData(prev => ({ ...prev, milk_charges_computed: milkCharges.toFixed(2) }));
    }
  };

  const calculateTotalExpenditure = () => {
    const costFields = ['grocery_cost', 'vegetable_cost', 'gas_charges', 'milk_charges_computed', 'other_costs'];
    let total = 0;

    costFields.forEach(field => {
      const value = parseFloat(formData[field]) || 0;
      total += value;
    });

    setFormData(prev => ({
      ...prev,
      total_expenditure: total.toFixed(2),
      expenditure_after_income: (total - (parseFloat(formData.deductions_income) || 0)).toFixed(2)
    }));
  };

  const calculateExpenditureAfterIncome = () => {
    const totalExpenditure = parseFloat(formData.total_expenditure) || 0;
    const deductionsIncome = parseFloat(formData.deductions_income) || 0;
    setFormData(prev => ({
      ...prev,
      expenditure_after_income: (totalExpenditure - deductionsIncome).toFixed(2)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate mess fee per day based on total expenditure and student data
    const totalExpenditure = parseFloat(formData.expenditure_after_income) || 0;
    let totalStudentDays = 0;

    formData.years.forEach(year => {
      const students = parseInt(formData[`${['first', 'second', 'third', 'fourth'][year-1]}_year_students`]) || 0;
      const days = parseInt(formData[`${['first', 'second', 'third', 'fourth'][year-1]}_year_days`]) || 0;
      totalStudentDays += students * days;
    });

    const messFeePerDay = totalStudentDays > 0 ? totalExpenditure / totalStudentDays : 0;

    setFormData(prev => ({ ...prev, mess_fee_per_day: messFeePerDay.toFixed(2) }));

    setBillSummary({
      month_year: formData.month_year,
      total_expenditure: formData.total_expenditure,
      expenditure_after_income: formData.expenditure_after_income,
      mess_fee_per_day: messFeePerDay.toFixed(2),
      selected_years: formData.years,
      total_student_days: totalStudentDays
    });
  };

  const fetchExistingBills = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setSuccess('Existing mess bills data loaded successfully!');
      setExistingBills({
        months: [
          {
            title: 'March 2023',
            date: 'Created: March 15, 2023, 10:30 AM',
            totalBills: 24,
            totalAmount: 58420,
            costs: [
              { label: 'Paid Bills', value: 18 },
              { label: 'Pending Bills', value: 6 },
              { label: 'Computer Science', value: 12450 },
              { label: 'Electrical', value: 10680 },
              { label: 'Mechanical', value: 9870 },
              { label: 'Civil', value: 8920 },
              { label: 'Chemical', value: 7560 },
              { label: 'Other Departments', value: 8940 },
              { label: 'Average Bill Amount', value: 2434.17 },
              { label: 'Highest Bill', value: 3250 },
              { label: 'Total Revenue', value: 58420 }
            ],
            departments: [
              { name: 'Computer Science', bills: 8, amount: 12450 },
              { name: 'Electrical', bills: 6, amount: 10680 },
              { name: 'Mechanical', bills: 5, amount: 9870 },
              { name: 'Civil', bills: 3, amount: 8920 }
            ],
            bills: [
              { name: 'John Doe', room: '101', days: 28, rate: 150, extra: 350, total: 4550, status: 'pending' },
              { name: 'Jane Smith', room: '205', days: 25, rate: 150, extra: 200, total: 3950, status: 'pending' },
              { name: 'Robert Johnson', room: '312', days: 30, rate: 150, extra: 450, total: 4950, status: 'verified' }
            ]
          },
          {
            title: 'February 2023',
            date: 'Created: February 14, 2023, 09:15 AM',
            totalBills: 22,
            totalAmount: 52180,
            costs: [
              { label: 'Paid Bills', value: 16 },
              { label: 'Pending Bills', value: 6 },
              { label: 'Computer Science', value: 11200 },
              { label: 'Electrical', value: 9850 },
              { label: 'Mechanical', value: 8760 },
              { label: 'Civil', value: 7920 },
              { label: 'Chemical', value: 6890 },
              { label: 'Other Departments', value: 7560 },
              { label: 'Average Bill Amount', value: 2371.82 },
              { label: 'Highest Bill', value: 3150 },
              { label: 'Total Revenue', value: 52180 }
            ],
            departments: [
              { name: 'Computer Science', bills: 7, amount: 11200 },
              { name: 'Electrical', bills: 5, amount: 9850 },
              { name: 'Mechanical', bills: 4, amount: 8760 },
              { name: 'Civil', bills: 4, amount: 7920 }
            ],
            bills: [
              { name: 'John Doe', room: '101', days: 25, rate: 150, extra: 300, total: 4050, status: 'verified' },
              { name: 'Jane Smith', room: '205', days: 22, rate: 150, extra: 150, total: 3450, status: 'verified' }
            ]
          }
        ]
      });
    }, 1500);
  };

  const toggleCard = (index) => {
    sessionStorage.setItem('monthData', JSON.stringify(existingBills.months[index]));
    navigate('/mess-bills-detail');
  };

  const showIndividualBills = (index) => {
    setShownBills(prev => ({ ...prev, [index]: true }));
  };

  const hideIndividualBills = (index) => {
    setShownBills(prev => ({ ...prev, [index]: false }));
  };

  const verifyBill = (billIndex, monthIndex) => {
    // For demo, just log
    console.log(`Verify bill ${billIndex} in month ${monthIndex}`);
  };

  return (
    <div className="container">
      <header>
        <h1>Mess Bill Management</h1>
        <p className="subtitle">Manage your new and existing mess bills in one place</p>
      </header>

      <div className="navigation">
        <button className={`nav-btn ${activeSection === 'new-bill' ? 'active' : ''}`} onClick={() => handleNavClick('new-bill')}>New Mess Bill</button>
        <button className={`nav-btn ${activeSection === 'existing-bill' ? 'active' : ''}`} onClick={() => handleNavClick('existing-bill')}>Existing Mess Bills</button>
      </div>

      <section id="new-bill" className={`content-section ${activeSection === 'new-bill' ? 'active' : ''}`}>
        <h2>Create Monthly Calculation</h2>

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
              </div>
              <div className="form-group">
                <label>Academic Years *</label>
                <div className="checkbox-group">
                  {[1, 2, 3, 4].map(year => (
                    <div key={year} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`year${year}`}
                        name="years"
                        value={year}
                        checked={formData.years.includes(year)}
                        onChange={handleInputChange}
                      />
                      <label htmlFor={`year${year}`}>{year === 1 ? 'First' : year === 2 ? 'Second' : year === 3 ? 'Third' : 'Fourth'} Year</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cost Details Section */}
          <div className="form-section">
            <div className="form-section-title">Cost Details</div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="grocery_cost">Grocery Cost *</label>
                <input
                  type="number"
                  step="0.01"
                  id="grocery_cost"
                  name="grocery_cost"
                  value={formData.grocery_cost}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="vegetable_cost">Vegetable Cost *</label>
                <input
                  type="number"
                  step="0.01"
                  id="vegetable_cost"
                  name="vegetable_cost"
                  value={formData.vegetable_cost}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gas_charges">Gas Charges *</label>
                <input
                  type="number"
                  step="0.01"
                  id="gas_charges"
                  name="gas_charges"
                  value={formData.gas_charges}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="total_milk_litres">Total Milk Litres</label>
                <input
                  type="number"
                  step="0.01"
                  id="total_milk_litres"
                  name="total_milk_litres"
                  value={formData.total_milk_litres}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="milk_cost_per_litre">Milk Cost Per Litre</label>
                <input
                  type="number"
                  step="0.01"
                  id="milk_cost_per_litre"
                  name="milk_cost_per_litre"
                  value={formData.milk_cost_per_litre}
                  onChange={handleInputChange}
                />
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
                  type="number"
                  step="0.01"
                  id="other_costs"
                  name="other_costs"
                  value={formData.other_costs}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="deductions_income">Deductions/Income</label>
                <input
                  type="number"
                  step="0.01"
                  id="deductions_income"
                  name="deductions_income"
                  value={formData.deductions_income}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="veg_extra_per_day">Veg Extra Per Day</label>
                <input
                  type="number"
                  step="0.01"
                  id="veg_extra_per_day"
                  name="veg_extra_per_day"
                  value={formData.veg_extra_per_day}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="nonveg_extra_per_day">Non-Veg Extra Per Day</label>
                <input
                  type="number"
                  step="0.01"
                  id="nonveg_extra_per_day"
                  name="nonveg_extra_per_day"
                  value={formData.nonveg_extra_per_day}
                  onChange={handleInputChange}
                />
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
                  type="number"
                  step="0.01"
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
                  required
                />
              </div>
            </div>
          </div>

          {/* Year-wise Data Section */}
          <div className="form-section">
            <div className="form-section-title">Year-wise Student Data</div>
            <div className="form-grid">
              {/* First Year */}
              <div className="form-group">
                <label htmlFor="first_year_students">First Year Students</label>
                <input
                  type="number"
                  id="first_year_students"
                  name="first_year_students"
                  value={formData.first_year_students}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="first_year_days">First Year Days</label>
                <input
                  type="number"
                  id="first_year_days"
                  name="first_year_days"
                  value={formData.first_year_days}
                  onChange={handleInputChange}
                />
              </div>

              {/* Second Year */}
              <div className="form-group">
                <label htmlFor="second_year_students">Second Year Students</label>
                <input
                  type="number"
                  id="second_year_students"
                  name="second_year_students"
                  value={formData.second_year_students}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="second_year_days">Second Year Days</label>
                <input
                  type="number"
                  id="second_year_days"
                  name="second_year_days"
                  value={formData.second_year_days}
                  onChange={handleInputChange}
                />
              </div>

              {/* Third Year */}
              <div className="form-group">
                <label htmlFor="third_year_students">Third Year Students</label>
                <input
                  type="number"
                  id="third_year_students"
                  name="third_year_students"
                  value={formData.third_year_students}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="third_year_days">Third Year Days</label>
                <input
                  type="number"
                  id="third_year_days"
                  name="third_year_days"
                  value={formData.third_year_days}
                  onChange={handleInputChange}
                />
              </div>

              {/* Fourth Year */}
              <div className="form-group">
                <label htmlFor="fourth_year_students">Fourth Year Students</label>
                <input
                  type="number"
                  id="fourth_year_students"
                  name="fourth_year_students"
                  value={formData.fourth_year_students}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fourth_year_days">Fourth Year Days</label>
                <input
                  type="number"
                  id="fourth_year_days"
                  name="fourth_year_days"
                  value={formData.fourth_year_days}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-reset" onClick={() => setFormData({
              month_year: '',
              years: [1, 2, 3, 4],
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
              total_expenditure: '',
              expenditure_after_income: '',
              mess_fee_per_day: '',
              first_year_students: '',
              first_year_days: '',
              second_year_students: '',
              second_year_days: '',
              third_year_students: '',
              third_year_days: '',
              fourth_year_students: '',
              fourth_year_days: ''
            })}>Reset Form</button>
            <button type="submit" className="btn btn-search">Calculate Monthly Bill</button>
          </div>
        </form>

        {billSummary && (
          <div id="bill-summary" className="bill-summary">
            <h3>Monthly Calculation Summary</h3>
            <div className="bill-item">
              <span>Month-Year:</span>
              <span>{billSummary.month_year}</span>
            </div>
            <div className="bill-item">
              <span>Total Expenditure:</span>
              <span>₹{billSummary.total_expenditure}</span>
            </div>
            <div className="bill-item">
              <span>Expenditure After Income:</span>
              <span>₹{billSummary.expenditure_after_income}</span>
            </div>
            <div className="bill-item">
              <span>Mess Fee Per Day:</span>
              <span>₹{billSummary.mess_fee_per_day}</span>
            </div>
            <div className="bill-item">
              <span>Selected Years:</span>
              <span>{billSummary.selected_years.join(', ')}</span>
            </div>
            <div className="bill-item">
              <span>Total Student-Days:</span>
              <span>{billSummary.total_student_days}</span>
            </div>
            <button className="btn">Save Monthly Calculation</button>
          </div>
        )}
      </section>

      <section id="existing-bill" className={`content-section ${activeSection === 'existing-bill' ? 'active' : ''}`}>
        <div className="controls">
          <h2>Existing Mess Bills</h2>
          <button id="fetchData" className="btn" onClick={fetchExistingBills}>Refresh Data</button>
        </div>

        {loading && (
          <div id="loadingMonthly" className="loading">
            <p>Loading existing mess bills data...</p>
            <div>
              <div style={{display: 'inline-block', width: '20px', height: '20px', border: '3px solid #f3f3f3', borderTop: '3px solid #4a6cf7', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
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
              <div key={index} className={`month-card ${expandedCards[index] ? 'expanded' : ''}`}>
                <div className="month-header" onClick={() => toggleCard(index)} style={{cursor: 'pointer'}}>
                  <div>
                    <div className="month-title">{month.title}</div>
                    <div className="month-date">{month.date}</div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '0.9rem', opacity: 0.9}}>Total Bills: {month.totalBills}</div>
                    <div style={{fontSize: '0.9rem', opacity: 0.9}}>Total Amount: ₹{month.totalAmount.toFixed(2)}</div>
                    <div className="expand-icon">▼</div>
                  </div>
                </div>

                <div className="month-content">
                  <table className="costs-table">
                    <thead>
                      <tr>
                        <th>Bill Category</th>
                        <th>Amount</th>
                        <th>Bill Category</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {month.costs.map((cost, i) => (
                        i % 2 === 0 ? (
                          <tr key={i}>
                            <td>{cost.label}</td>
                            <td className="cost-value">{typeof cost.value === 'number' && cost.value > 100 ? `₹${cost.value.toFixed(2)}` : cost.value}</td>
                            {month.costs[i+1] && (
                              <>
                                <td>{month.costs[i+1].label}</td>
                                <td className="cost-value">{typeof month.costs[i+1].value === 'number' && month.costs[i+1].value > 100 ? `₹${month.costs[i+1].value.toFixed(2)}` : month.costs[i+1].value}</td>
                              </>
                            )}
                          </tr>
                        ) : null
                      ))}
                    </tbody>
                  </table>

                  <div className="years-section">
                    <h3>Department-wise Breakdown</h3>
                    <div className="years-grid">
                      {month.departments.map((dept, i) => (
                        <div key={i} className="year-card">
                          <div className="year-title">{dept.name}</div>
                          <div className="year-stats">
                            <div className="stat">
                              <div className="stat-value">{dept.bills}</div>
                              <div className="stat-label">Bills</div>
                            </div>
                            <div className="stat">
                              <div className="stat-value">₹{dept.amount}</div>
                              <div className="stat-label">Amount</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="btn-show-bills" onClick={(e) => { e.stopPropagation(); sessionStorage.setItem('monthData', JSON.stringify(month)); navigate('/mess-bills-detail'); }}>View Full Details</button>
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

          .month-card.expanded {
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
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

          .expand-icon {
            font-size: 1.2rem;
            transition: transform 0.3s ease;
          }

          .month-card.expanded .expand-icon {
            transform: rotate(180deg);
          }

          .month-content {
            padding: 20px;
            display: none;
          }

          .month-card.expanded .month-content {
            display: block;
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
