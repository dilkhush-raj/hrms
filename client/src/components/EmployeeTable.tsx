import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { handleDeleteUser } from "../utils/DeleteUser";
import EmployeeForm from "./forms/UpdateEmployee";
import "../styles/CandidateTable.css";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  position: string;
  department: string;
  joiningDate: Date;
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [departments, setDepartments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const apiUrl = `${
    import.meta.env.VITE_BACKEND_HOST_URL
  }/api/v1/users/employees`;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(apiUrl, {
          withCredentials: true,
        });
        if (response.status === 200) {
          const employees = response.data.users;
          setEmployees(employees);
          setFilteredEmployees(employees);

          // Extract unique departments
          const uniqueDepartments = Array.from(
            new Set(
              employees.map((emp: Employee) => emp.department).filter(Boolean)
            )
          );
          setDepartments(uniqueDepartments as string[]);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [apiUrl]);

  useEffect(() => {
    const filterEmployees = () => {
      let filtered = employees;
      if (departmentFilter !== "All") {
        filtered = filtered.filter(
          (employee) => employee.department === departmentFilter
        );
      }
      if (searchTerm) {
        filtered = filtered.filter((employee) =>
          Object.values(employee).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      setFilteredEmployees(filtered);
    };
    filterEmployees();
  }, [employees, departmentFilter, searchTerm]);

  const handleUpdateClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="container">
      {isUpdateModalOpen && selectedEmployee && (
        <EmployeeForm
          // @ts-expect-error fdsa
          employee={selectedEmployee}
          toggleModal={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
        />
      )}
      <div className="mb-4">
        <div className="flex justify-between items-center gap-4">
          <select
            className="filter-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          <div className="search-box">
            <Search className="icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map((employee, index) => {
              const date = new Date(employee.joiningDate).toLocaleDateString();
              return (
                <tr key={employee._id} className="cursor">
                  <td>{index + 1}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{date}</td>
                  <td>
                    <button onClick={() => handleUpdateClick(employee)}>
                      <Edit className="icon" />
                    </button>
                    <button onClick={() => handleDeleteUser(employee._id)}>
                      <Trash2 className="icon" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
