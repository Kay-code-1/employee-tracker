const connection = require("./connection");

class DB {
  // Keeping a reference to the connection on the class in case we need it later
  constructor(connection) {
    this.connection = connection;
  }

  // Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
  findAllEmployees() {
    return this.connection.query(
      `SELECT e.employee_id, e.first_name, e.last_name, d.name as 'department_name', r.salary, r.title
      FROM employees.employee e, employees.department d, employees.role r
      WHERE e.role_id = r.role_id AND r.department_id = d.department_id`
    );
  }

  // Find all employees except the given employee id
  findAllPossibleManagers(employee_id) {
    return this.connection.query(
      `SELECT employee_id, first_name, last_name FROM employee WHERE manager_id is NULL`
    );
  }

  // Create a new employee
  createEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }

  // Update the given employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection
      .query
      // TODO: YOUR CODE HERE
      ();
  }

  // Update the given employee's manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }

  // Find all roles, join with departments to display the department name
  findAllRoles() {
    return this.connection.query(
      `SELECT r.role_id as Role_ID, r.title as Role_Title, r.salary as salary, d.name as Department_name
        FROM role r LEFT JOIN department d 
        ON r.department_id = d.department_id`
    );
  }

  // Create a new role
  createRole(role) {
    return this.connection.query(
      // TODO: YOUR CODE HERE
      `INSERT into role(title, department_id, salary) VALUES (${role.title}, ${role.departmentChoices}, ${role.salary})`
    );
  }

  // Find all departments, join with employees and roles and sum up utilized department budget
  findAllDepartments() {
    return this.connection.query(
      `SELECT 
      department.department_id,
      department.name,
      SUM(role.salary) AS utilized_budget
  FROM
      department
          LEFT JOIN
      role ON role.department_id = department.department_id
          LEFT JOIN
      employee ON employee.role_id = role.role_id
  GROUP BY department.department_id , department.name`
    );
  }

  // Create a new department
  createDepartment(department) {
    return this.connection
      .query
      // TODO: YOUR CODE HERE
      ();
  }

  // Find all employees in a given department, join with roles to display role titles
  findAllEmployeesByDepartment(departmentId) {
    return this.connection.query(
      `SELECT 
      employee.employee_id,
      employee.first_name,
      employee.last_name,
      role.title
  FROM
      employee
          LEFT JOIN
      role ON employee.role_id = role.role_id
          LEFT JOIN
      department department ON role.department_id = department.department_id
  WHERE
      department.department_id = ${departmentId}`
    );
  }

  // Find all employees by manager, join with departments and roles to display titles and department names
  findAllEmployeesByManager(managerId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
      managerId
    );
  }
}

module.exports = new DB(connection);
