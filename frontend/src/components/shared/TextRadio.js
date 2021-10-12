import React from 'react';

export default ({ label, name, type, value, checked, className, error=true, errors = '', ...props }) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label}:
        </label>
      )}
      <input
		    type={type}
        name={name}
        value={value}
        checked={checked}
        {...props}
        className={`${errors ? 'is-invalid' : ''}`}
      />
	  {(error && errors) && <div className="invalid-feedback">{errors}</div>}
    </div>
  );
};
