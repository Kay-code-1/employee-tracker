const connection = require("./connection");

class DB {
  // Keeping a reference to the connection on the class in case we need it later
  constructor(connection) {
    this.connection = connection;
  }

  // Find all employees details: roles, salaries, departments
  findAllEmployees() {
    return this.connection.query(
      `SELECT e.employee_id, e.first_name, e.last_name, d.name as 'department_name', r.salary, r.title
      FROM employees.employee e, employees.department d, employees.role r
      WHERE e.role_id = r.role_id AND r.department_id = d.department_id
      ORDER BY e.employee_id`
    );
  }

  // Find all employees details: Employee ID, First Name, Last Name and managers
  findAllEmpManagers() {
    return this.connection.query(
      `SELECT 
        e.employee_id, 
        e.first_name,
        e.last_name,
        m.employee_id AS manager_id,
        m.first_name AS manager_first_name,
        m.last_name AS manager_last_name
      FROM
        employee e 
      LEFT JOIN
        employee m ON e.manager_id = m.employee_id
      ORDER BY manager_id`
    );
  }

  // Find all employees except the given employee id
  findAllPossibleManagers(employeeId) {
    return this.connection.query(
      "SELECT employee_id, first_name, last_name FROM employee WHERE employee_id != ?",[employeeId]);
  }

  // Create a new employee
  createEmployee(employee) {
    return this.connection.query(
      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
      [
        employee.first_name,
        employee.last_name,
        employee.role_id,
        employee.manager_id,
      ]
    );
  }

  // Update the given employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      "UPDATE employee SET role_id = ? WHERE employee_id = ?",
      [roleId, employeeId]
    );
  }

  //Find only managers
  findOnlyManagers() {
    return this.connection.query(
     `SELECT DISTINCT m.employee_id, m.first_name, m.last_name FROM employee e, employee m WHERE e.manager_id = m.employee_id`
    );
  }

  // Update the given employee's manager
  updateEmployeeManager(managerId, employeeId) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE employee_id = ?",
      [managerId, employeeId]
    );
  }

  // Find all roles, join with departments to display the department name
  findAllRoles() {
    return this.connection.query(
      `SELECT r.role_id, r.title, r.salary as salary, d.name as department_name
        FROM role r LEFT JOIN department d 
        ON r.department_id = d.department_id`
    );
  }

  // Create a new role
  createRole(role) {
    return this.connection.query(
      `INSERT into role(title, department_id, salary) VALUES ('${role.title}', ${role.department_id}, ${role.salary})`
    );
  }

  // Find all departments, join with employees and roles and sum up utilized department budget
  findAllDepartments() {
    return this.connection.query(
      `SELECT 
        d.department_id,
        d.name,
        SUM(r.salary) AS utilized_budget
      FROM
        department d
            LEFT JOIN
        role r ON r.department_id = d.department_id
            LEFT JOIN
        employee e ON e.role_id = r.role_id
      GROUP BY d.department_id , d.name`
    );
  }

  // Create a new department
  createDepartment(department) {
    return this.connection.query(
      `INSERT INTO DEPARTMENT(name) VALUES ('${department.name}')`
    );
  }

  // Delete a department
  deleteDepartment(deletedDept) {
    return this.connection.query(
      "DELETE FROM DEPARTMENT where department_id = ?",
      [deletedDept]
    );
  }

  // Find all employees in a given department, join with roles to display role titles
  findAllEmployeesByDepartment(departmentId) {
    return this.connection.query(
      `SELECT 
          e.employee_id,
          e.first_name,
          e.last_name,
          r.title
      FROM
          employee e
        LEFT JOIN
          role r ON e.role_id = r.role_id
        LEFT JOIN
          department d ON r.department_id = d.department_id
      WHERE
          d.department_id = ${departmentId}`
    );
  }

  // Find all employees by manager, join with departments and roles to display titles and department names
  findAllEmployeesByManager(managerId) {
    return this.connection.query(
      `SELECT 
        e.employee_id,
        e.first_name,
        e.last_name,
        d.name AS department,
        r.title 
      FROM employee e 
        LEFT JOIN
          role r ON r.role_id = e.role_id 
        LEFT JOIN
          department d ON d.department_id = r.department_id 
      WHERE
        e.manager_id = ${managerId}`
    );
  }
}

module.exports = new DB(connection);
