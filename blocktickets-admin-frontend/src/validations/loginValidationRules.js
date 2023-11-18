export default function validate(values) {
  let errors = {};
  if (!values.email) {
    errors.email = "Email is required";
  } else if (values.email)
    if (!values.password) {
      errors.password = "Password is required";
    }

  return errors;
}
