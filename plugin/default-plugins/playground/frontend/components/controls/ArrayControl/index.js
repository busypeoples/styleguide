import React, { cloneElement } from 'react';
import range from 'lodash/range';
import cloneDeep from 'lodash/cloneDeep';
import Label from '../../common/Label';
import valueOrNullOrUndefined from '../../../utils/valueOrNullOrUndefined';
import getControl from '../../../utils/getControl';

import objectControlStyles from '../ObjectControl/styles.css';

const ArrayControl = ({ label, onUpdate, value, propTypeData, isNested }) => {
  const size = value === null || typeof value === 'undefined' ? 0 : value.length;
  const rangeArray = range(size);

  const onUpdateEntry = (data, index) => {
    const newValue = cloneDeep(value);
    newValue[index] = data;
    onUpdate({ value: newValue });
  };

  const addItem = () => ({ value: [...value || [], ...ArrayControl.randomValue(propTypeData, 1)] });
  const removeItem = () => ({ value: [...value.slice(0, size - 1)] });

  const control = getControl(propTypeData.value);

  return (
    <div className={objectControlStyles.wrapper}>
      <Label
        text={label}
        onRandomClick={() => onUpdate({ value: ArrayControl.randomValue(propTypeData) })}
      />
      {(size !== 0) && (
        <div
          className={
            (isNested) ?
            objectControlStyles.nestedControls :
            objectControlStyles.wrapper
          }
          style={{
            paddingLeft: '1rem',
          }}
        >
          {rangeArray && rangeArray.map((index) => {
            const newProps = {
              key: index,
              value: value[index],
              onUpdate: (data) => onUpdateEntry(data.value, index),
              isNested: true,
            };
            return cloneElement(control, newProps);
          })}
        </div>
      )}

      <div>
        <button onClick={() => onUpdate(addItem())}>+</button>
        {size > 0 && <button onClick={() => onUpdate(removeItem())}>-</button>}
      </div>
    </div>
  );
};

ArrayControl.randomValue = (propTypeData, maxValues = null) => {
  const canBeNull = !propTypeData.required;
  const canBeUndefined = !propTypeData.required;
  // Restrict random arrays to a length between 0 and 4 elements
  const min = 0;
  const max = maxValues || 4;
  const size = Math.floor(Math.random() * (max - min + 1)) + min;
  const rangeArray = range(min, size);
  // Get the prop type data of the insides of the array
  const innerPropTypeData =
    propTypeData.value
    || propTypeData.type
    && propTypeData.type.value; // TODO clean up
  const control = getControl(innerPropTypeData);

  // Generate a random value for each propType in the array
  const value = rangeArray.map(() => control.type.randomValue(innerPropTypeData));

  return valueOrNullOrUndefined(value, canBeNull, canBeUndefined);
};

export default ArrayControl;
