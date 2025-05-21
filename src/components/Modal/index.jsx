import './modal.css';

export const ButtonCustom = ({ children, onClick, variant = 'primary' }) => {
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

export const ModalCustom = ({ show, onHide, children, title, size }) => {
  if (!show) return null;

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  return (
    <div className="modal-overlay" onClick={onHide}>
      <div 
        className={`modal-content ${sizeClasses[size] || ''}`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onHide}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ModalHeader = ({ children }) => (
  <div className="modal-header">{children}</div>
);

export const ModalBody = ({ children }) => (
  <div className="modal-body">{children}</div>
);

export const ModalFooter = ({ children }) => (
  <div className="modal-footer">{children}</div>
);