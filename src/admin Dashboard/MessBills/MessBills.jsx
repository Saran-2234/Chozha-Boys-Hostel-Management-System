import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import BillTable from './BillTable';

const MessBills = ({ isDarkMode }) => {
  // Input states
  const [groceryCost, setGroceryCost] = useState('');
  const [vegetableCost, setVegetableCost] = useState('');
  const [gasCharges, setGasCharges] = useState('');
  const [milkCharges, setMilkCharges] = useState('');
  const [otherCosts, setOtherCosts] = useState('');
  const [deductions, setDeductions] = useState('');
  const [totalStudents, setTotalStudents] = useState('');
  const [totalDays, setTotalDays] = useState('');
  const [reductionDays, setReductionDays] = useState('');

  // Calculation results
  const [netExpenditure, setNetExpenditure] = useState(0);
  const [applicableStudentDays, setApplicableStudentDays] = useState(0);
  const [messFeePerDay, setMessFeePerDay] = useState(0);
  const [vegFeePerDay, setVegFeePerDay] = useState(0);
  const [nonVegFeePerDay, setNonVegFeePerDay] = useState(0);
  const [calculated, setCalculated] = useState(false);

  // Filters
  const [yearFilter, setYearFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Mock students data
  const mockStudents = [
    { id: 'ST001', name: 'John Doe', year: '1st', department: 'CSE', daysPresent: 28, vegDays: 28, nonVegDays: 0 },
    { id: 'ST002', name: 'Jane Smith', year: '2nd', department: 'ECE', daysPresent: 25, vegDays: 25, nonVegDays: 0 },
    { id: 'ST003', name: 'Bob Johnson', year: '3rd', department: 'MECH', daysPresent: 28, vegDays: 20, nonVegDays: 8 },
    // Add more mock data as needed
  ];

  const handleCalculate = () => {
    const totalExpenditure = parseFloat(groceryCost) + parseFloat(vegetableCost) + parseFloat(gasCharges) + parseFloat(milkCharges) + parseFloat(otherCosts);
    const netExp = totalExpenditure - parseFloat(deductions || 0);
    const totalPossibleDays = parseInt(totalStudents) * parseInt(totalDays);
    const applicableDays = totalPossibleDays - parseInt(reductionDays || 0);
    const feePerDay = Math.round(netExp / applicableDays);
    // Assume veg and non-veg fees based on example; in real, calculate from separate costs
    const vegFee = Math.round(feePerDay * 0.8); // Placeholder
    const nonVegFee = Math.round(feePerDay * 1.2); // Placeholder

    setNetExpenditure(netExp);
    setApplicableStudentDays(applicableDays);
    setMessFeePerDay(feePerDay);
    setVegFeePerDay(vegFee);
    setNonVegFeePerDay(nonVegFee);
    setCalculated(true);
  };

  const handleBulkSendYearDept = () => {
    console.log(`Send bills to ${yearFilter} year ${departmentFilter} department`);
  };

  const handleSendAll = () => {
    console.log('Send bills to all students');
  };

  const handleDownloadExcel = () => {
    // Simulate Excel download
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(mockStudents.map(s => `${s.id},${s.name},${s.daysPresent},${s.vegDays},${s.nonVegDays},${(s.vegDays * vegFeePerDay + s.nonVegDays * nonVegFeePerDay)}`).join("\n"));
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
                type="number"
                value={groceryCost}
                onChange={(e) => setGroceryCost(e.target.value)}
                placeholder="Enter grocery cost"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Vegetable Cost</label>
              <input
                type="number"
                value={vegetableCost}
                onChange={(e) => setVegetableCost(e.target.value)}
                placeholder="Enter vegetable cost"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Gas Charges</label>
              <input
                type="number"
                value={gasCharges}
                onChange={(e) => setGasCharges(e.target.value)}
                placeholder="Enter gas charges"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Milk Charges</label>
              <input
                type="number"
                value={milkCharges}
                onChange={(e) => setMilkCharges(e.target.value)}
                placeholder="Enter milk charges"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Other Costs</label>
              <input
                type="number"
                value={otherCosts}
                onChange={(e) => setOtherCosts(e.target.value)}
                placeholder="Enter other costs"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Deductions / Income</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                placeholder="Enter deductions"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Total Students</label>
              <input
                type="number"
                value={totalStudents}
                onChange={(e) => setTotalStudents(e.target.value)}
                placeholder="Enter total students"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Total Days in Month</label>
              <input
                type="number"
                value={totalDays}
                onChange={(e) => setTotalDays(e.target.value)}
                placeholder="Enter total days"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Reduction Days</label>
              <input
                type="number"
                value={reductionDays}
                onChange={(e) => setReductionDays(e.target.value)}
                placeholder="Enter reduction days"
                className={`w-full px-3 py-2 border rounded-md text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleCalculate} variant="primary" isDarkMode={isDarkMode}>
              Calculate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      {calculated && (
        <Card isDarkMode={isDarkMode}>
          <CardHeader>
            <h3 className="text-lg font-semibold">Calculation Results</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Net Expenditure</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{netExpenditure.toLocaleString()}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Applicable Student-Days</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{applicableStudentDays}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mess Fee per Day</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{messFeePerDay}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Veg Fee per Day</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{vegFeePerDay}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Non-Veg Fee per Day</p>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{nonVegFeePerDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                className={`px-3 py-2 border rounded-md text-sm ${
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
                className={`px-3 py-2 border rounded-md text-sm ${
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
