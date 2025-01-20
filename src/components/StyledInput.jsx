import styled from 'styled-components';

const StyledInput = ({ value, onChange, placeholder }) => {
  return (
    <StyledWrapper>
      <div className="form-control">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input input-alt font-technor-regular"
        />
        <span className="input-border input-border-alt" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .input {
    color: #000;
    font-size: 0.9rem;
    background-color: #C1D8C3;
    width: 100%;
    box-sizing: border-box;
    padding-inline: 0.5em;
    padding-block: 0.7em;
    border: none;
    border-bottom: var(--border-height) solid var(--border-before-color);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .input-border {
    position: absolute;
    background: var(--border-after-color);
    height: 2px;
    width: 100%;
    bottom: 0;
    left: 0;
    transform: scaleX(0%);
    transition: transform 0.3s cubic-bezier(0.6, -0.28, 0.735, 0.045);
  }

  .input:focus {
    outline: none;
  }

  .input:focus + .input-border {
    transform: scaleX(100%);
  }

  .form-control {
    position: relative;
    --width-of-input: 300px;
  }

  .input-alt {
    font-size: 1.2rem;
    padding-inline: 1em;
    padding-block: 0.8em;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #ccc;
    border-radius: 0.375rem;
    focus:outline-none;
    focus:ring-2;
    focus:ring-blue-500;
  }

  .input-border-alt {
    height: 3px;
    background: linear-gradient(90deg, #ff6464 0%, #ffbf59 50%, #47c9ff 100%);
    transition: transform 0.4s cubic-bezier(0.42, 0, 0.58, 1);
  }

  .input-alt:focus + .input-border-alt {
    transform: scaleX(100%);
  }
`;

export default StyledInput;
