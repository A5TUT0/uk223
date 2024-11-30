import React from 'react';
import styled from 'styled-components';

interface TextareaProps {
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  disabled?: boolean;
}

const StyledTextarea = styled.textarea`
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  padding: 12px;
  font-size: 16px;
  line-height: 1.5;
  color: #e4e4e4; /* Texto claro */
  background-color: #09090B; /* Fondo oscuro ligeramente más claro */
  border: 1px solid #3a3a4a; /* Borde oscuro */
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  resize: vertical;

  &:focus {
    border-color: #4f9cff; /* Borde azul al enfocar */
    box-shadow: 0 0 0 3px rgba(79, 156, 255, 0.3); /* Sombra azul */
  }

  &:disabled {
    background-color: #1a1a1d; /* Fondo más claro para disabled */
    color: #6c757d; /* Texto gris para disabled */
    cursor: not-allowed;
  }

  &::placeholder {
    color: #a1a1b3; /* Color placeholder tenue */
  }
`;

const Textarea: React.FC<TextareaProps> = ({
  value,
  placeholder = 'Enter text...',
  onChange,
  rows = 4,
  disabled = false,
}) => {
  return (
    <StyledTextarea
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
    />
  );
};

export { Textarea };
