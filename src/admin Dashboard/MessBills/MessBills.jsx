import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../Common/Card';
import Button from '../Common/Button';
import BillTable from './BillTable';

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

  const handleCalculate = () => {
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
                type="number"
                value={groceryCost}
                onChange={(e) => setGroceryCost(e.target.value)}
                placeholder="Enter grocery cost"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Vegetable Cost</label>
              <input
                type="number"
                value={vegetableCost}
                onChange={(e) => setVegetableCost(e.target.value)}
                placeholder="Enter vegetable cost"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Gas Charges</label>
              <input
                type="number"
                value={gasCharges}
                onChange={(e) => setGasCharges(e.target.value)}
                placeholder="Enter gas charges"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Total Milk Litres</label>
              <input
                type="number"
                value={milkLitres}
                onChange={(e) => setMilkLitres(e.target.value)}
                placeholder="Enter total litres"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Milk Cost per Litre</label>
              <input
                type="number"
                value={milkCostPerLitre}
                onChange={(e) => setMilkCostPerLitre(e.target.value)}
                placeholder="Enter cost per litre"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
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
                type="number"
                value={otherCosts}
                onChange={(e) => setOtherCosts(e.target.value)}
                placeholder="Enter other costs"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Deductions / Income</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                placeholder="Enter deductions"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>1st Year Students</label>
              <input
                type="number"
                step="1"
                value={students1st}
                onChange={(e) => setStudents1st(e.target.value)}
                placeholder="Enter 1st year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>1st Year Days</label>
              <input
                type="number"
                step="1"
                value={days1st}
                onChange={(e) => setDays1st(e.target.value)}
                placeholder="Enter 1st year days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>2nd Year Students</label>
              <input
                type="number"
                step="1"
                value={students2nd}
                onChange={(e) => setStudents2nd(e.target.value)}
                placeholder="Enter 2nd year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>2nd Year Days</label>
              <input
                type="number"
                step="1"
                value={days2nd}
                onChange={(e) => setDays2nd(e.target.value)}
                placeholder="Enter 2nd year days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>3rd Year Students</label>
              <input
                type="number"
                step="1"
                value={students3rd}
                onChange={(e) => setStudents3rd(e.target.value)}
                placeholder="Enter 3rd year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>3rd Year Days</label>
              <input
                type="number"
                step="1"
                value={days3rd}
                onChange={(e) => setDays3rd(e.target.value)}
                placeholder="Enter 3rd year days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>4th Year Students</label>
              <input
                type="number"
                step="1"
                value={students4th}
                onChange={(e) => setStudents4th(e.target.value)}
                placeholder="Enter 4th year students"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>4th Year Days</label>
              <input
                type="number"
                step="1"
                value={days4th}
                onChange={(e) => setDays4th(e.target.value)}
                placeholder="Enter 4th year days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
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
                type="number"
                step="1"
                value={reductionDays}
                onChange={(e) => setReductionDays(e.target.value)}
                placeholder="Enter reduction days"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Veg Extra per Day</label>
              <input
                type="number"
                step="1"
                value={vegExtraPerDay}
                onChange={(e) => setVegExtraPerDay(e.target.value)}
                placeholder="Enter veg extra per day"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Non-Veg Extra per Day</label>
              <input
                type="number"
                step="1"
                value={nonVegExtraPerDay}
                onChange={(e) => setNonVegExtraPerDay(e.target.value)}
                placeholder="Enter non-veg extra per day"
                className={`w-full px-3 py-2 border rounded-md text-sm cursor-text select-all pointer-events-auto ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
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
