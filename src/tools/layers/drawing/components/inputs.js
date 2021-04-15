export const createIntervalInput = (label, min, max, onChange, value, step = 1) => {
  const controlWrapper = document.createElement('div');
  controlWrapper.style.display = 'flex';
  controlWrapper.style.justifyContent = 'space-between';
  controlWrapper.style.alignItems = 'center';

  const inputWrapper = document.createElement('div');
  inputWrapper.appendChild(document.createTextNode(label));
  const control = document.createElement('input');
  control.setAttribute('type', 'range');
  control.setAttribute('min', min);
  control.setAttribute('max', max);
  control.setAttribute('step', step);
  control.onchange = (e) => {
    onChange(e.target.value);
    displayAmount.innerText = e.target.value;
  };
  control.value = value;
  inputWrapper.appendChild(control);

  controlWrapper.appendChild(inputWrapper);

  const displayAmount = document.createElement('span');
  displayAmount.innerText = value;
  controlWrapper.appendChild(displayAmount);

  return controlWrapper;
};

export const createCheck = (value, onCheck, prefix, label) => {
  const onChange = (e) => {
    const val = e.target.checked;
    onCheck(val);
  };
  const ID = prefix + '-check-input';
  const inputWrapper = document.createElement('div');
  inputWrapper.className = `${ID}-wrapper check-wrapper`;
  const check = document.createElement('input');
  check.type = 'checkbox';
  check.checked = value;
  check.id = ID;
  check.onchange = onChange;
  const checkLabel = document.createElement('label');
  checkLabel.for = ID;
  checkLabel.innerText = label;
  inputWrapper.appendChild(check);
  inputWrapper.appendChild(checkLabel);
  return inputWrapper;
};
