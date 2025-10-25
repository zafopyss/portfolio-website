type ButtonProps = { label: string; onClick: () => void };
const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button className="bg-red-500" onClick={onClick}>{label} </button>
);

export default Button;