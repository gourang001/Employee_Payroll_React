import { render, screen } from '@testing-library/react';
import Header from '../Component/Header/Header';

jest.mock('../assets/logo.jpeg', () => 'mocked-logo');
describe('Header Component', () => {
  test("renders the header with logo and title", () => {
    render(<Header />);
    const employeeText = screen.getByText('EMPLOYEE');
    const payrollText = screen.getByText('PAYROLL');
    const logoImage = screen.getByAltText('logo');

    expect(employeeText).toBeInTheDocument();
    expect(payrollText).toBeInTheDocument();
    expect(logoImage).toBeInTheDocument();
  });
});