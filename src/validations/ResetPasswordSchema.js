// validations/ResetPasswordSchema.js
import * as yup from "yup";

const ResetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب.")
    .email("صيغة البريد الإلكتروني غير صحيحة."),

  code: yup
    .string()
    .required("الكود مطلوب."),

  newPassword: yup
    .string()
    .required("كلمة المرور مطلوبة.")
    .min(6, "كلمة المرور يجب أن تكون بين 6 و 100 حرف.")
    .max(100, "كلمة المرور يجب أن تكون بين 6 و 100 حرف.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,100}$/,
      "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز (مثل !@#)."
    ),
});

export default ResetPasswordSchema;
