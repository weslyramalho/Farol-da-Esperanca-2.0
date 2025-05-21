const ButtonCustom = ({ children, onClick, variant = 'primary' }) => {
  const variants = {
    primary: 'btn-custom-primary',
    secondary: 'btn-custom-secondary',
    danger: 'btn-custom-danger'
  };

  return (
    <button 
      className={`btn-custom ${variants[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
export default ButtonCustom;