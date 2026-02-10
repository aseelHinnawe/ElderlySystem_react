import * as yup from "yup";

const RegisterEmpSchema = yup.object({
  fullName: yup
    .string()
    .required("الاسم الكامل مطلوب")
    .max(200, "الاسم الكامل طويل جدًا"),

  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .max(256, "البريد الإلكتروني طويل جدًا"),

  phoneNumber: yup
    .string()
    .required("رقم الهاتف مطلوب")
    .matches(/^\d{10}$/, "رقم الهاتف يجب أن يتكون من 10 أرقام"),

  city: yup
    .string()
    .required("المدينة مطلوبة")
    .max(100, "اسم المدينة طويل جدًا"),

  nationalId: yup
    .string()
    .required("رقم الهوية مطلوب")
    .matches(/^\d{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام"),

  gender: yup
    .string()
    .required("الجنس مطلوب")
    .oneOf(["Male", "Female"], "الجنس مطلوب"),

  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
    .max(100, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,100}$/,
      "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز (مثل !@#)"
    ),
  certificate: yup
  .mixed()
  .required("يجب رفع صورة الشهادة")
  .test(
    "fileSize",
    "حجم الملف كبير جدًا (أقصى 10 ميغابايت)",
    (value) => !value || (value && value[0]?.size <= 10_000_000)
  )
  .test(
    "fileType",
    "نوع الملف غير مدعوم (jpeg أو png فقط)",
    (value) =>
      !value ||
      (value && ["image/jpeg", "image/png", "image/heic"].includes(value[0]?.type))
  ),

});

export default RegisterEmpSchema;
