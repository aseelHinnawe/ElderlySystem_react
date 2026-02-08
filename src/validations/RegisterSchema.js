import * as yup from "yup";

const registerSchema = yup.object({
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .max(256, "البريد الإلكتروني طويل جدًا"),

  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
    .max(100, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,100}$/,
      "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز (مثل !@#)"
    ),

  fullName: yup
    .string()
    .required("الاسم الكامل مطلوب")
    .max(200, "الاسم الكامل طويل جدًا"),

  phoneNumber: yup
    .string()
    .required("رقم الهاتف مطلوب")
    .matches(/^\d{10}$/, "رقم الهاتف يجب أن يكون مكوّن من 10 أرقام فقط"),

  nationalId: yup
    .string()
    .required("رقم الهوية مطلوب")
    .matches(/^\d{9}$/, "رقم الهوية يجب أن يكون مكونًا من 9 أرقام"),

  city: yup
    .string()
    .required("المدينة مطلوبة")
    .max(100, "اسم المدينة طويل جدًا"),

  gender: yup
    .string()
    .required("الجنس مطلوب")
    .oneOf(["Male", "Female"], "الجنس مطلوب"),

});

export default registerSchema;
