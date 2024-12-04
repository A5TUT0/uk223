import React from 'react';
import styled from 'styled-components';

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: #ffffff;
  background-color: #000000;
  border: 1px solid #444444;
  border-radius: 8px;
  resize: vertical;

  &:focus {
    border-color: white;
    box-shadow: 0 0 0 2px white;
  }

  &:disabled {
    background-color: #1a1a1d;
    color: #6c757d;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #666666;
  }
`;

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  ...props
}) => <StyledTextarea {...props} />;

export { Textarea };
