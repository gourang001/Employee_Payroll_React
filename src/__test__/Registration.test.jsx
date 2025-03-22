import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Registration from '../Component/Register/Registration';

// Mock image imports to prevent module resolution errors
jest.mock('../../assets/logo.jpeg', () => 'mocked-logo');
jest.mock('../../assets/person1.jpeg', () => 'mocked-person1');
jest.mock('../../assets/person2.jpeg', () => 'mocked-person2');
jest.mock('../../assets/person3.jpeg', () => 'mocked-person3');
jest.mock('../../assets/person4.jpeg', () => 'mocked-person4');

describe('Registration Component', () => {
  test("renders Employee Payroll Form title", () => {
    render(<Registration />);
    expect(screen.getByText("Employee Payroll Form")).toBeInTheDocument();
  });

  test('renders the Name label', () => {
    render(<Registration />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  test('renders gender radio buttons', () => {
    render(<Registration />);
    const maleRadio = screen.getByLabelText('Male');
    const femaleRadio = screen.getByLabelText('Female');

    expect(maleRadio).toBeInTheDocument();
    expect(femaleRadio).toBeInTheDocument();
  });

  test("selects a department", () => {
    render(<Registration />);
    const hrCheckbox = screen.getByLabelText('HR');
    fireEvent.click(hrCheckbox);
    expect(hrCheckbox).toBeChecked();
  });

  test("select salary using getAllByRole", () => {
    render(<Registration />);
    const selects = screen.getAllByRole("combobox");
    const salarySelect = selects.find(select => select.id === 'salary');
    
    fireEvent.change(salarySelect, { target: { value: "₹10,000" } });
    expect(salarySelect).toHaveValue("₹10,000"); // Use toHaveValue for controlled components
  });

  test('should render textarea and allow user to type', () => {
    render(<Registration />);
  
    const textarea = screen.getByLabelText(/notes/i);
    expect(textarea).toBeInTheDocument();
  
    fireEvent.change(textarea, { target: { value: 'Test note' } });
    expect(screen.getByDisplayValue('Test note')).toBeInTheDocument();
  });
});