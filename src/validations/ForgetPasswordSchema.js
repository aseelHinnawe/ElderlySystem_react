import * as yup from "yup";

const ForgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .max(256, "البريد الإلكتروني طويل جدًا"),
});

export default ForgetPasswordSchema;
