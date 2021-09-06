DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
  department_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  role_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  department_id INT,
  salary DECIMAL(10, 2),
  FOREIGN KEY (department_id)
  REFERENCES department(department_id)
  ON DELETE CASCADE
);

CREATE TABLE employee (
  employee_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT NULL,
  FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee(employee_id) ON DELETE SET NULL
);
