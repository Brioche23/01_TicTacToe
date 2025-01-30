export function areThreeValuesEquals<S>(values: S[], empty?: S) {
  return (
    values[0] === values[1] && values[0] === values[2] && values[0] !== empty
  );
}
