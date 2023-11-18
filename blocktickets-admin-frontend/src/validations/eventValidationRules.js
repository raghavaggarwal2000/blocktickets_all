export default function validate(values) {
  let errors = {};

  for (const item in values) {
    if (!values[item]) errors[item] = `${item} is required`;
  }

  return errors;
}
