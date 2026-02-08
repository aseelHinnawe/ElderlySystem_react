import * as yup from "yup";

const LoginSchema = yup.object({
    email: yup
        .string()
        .required("البريد الإلكتروني مطلوب")
        .email("صيغة البريد الإلكتروني غير صحيحة")
        .max(256, "البريد الإلكتروني طويل جدًا"),

    password: yup
        .string()
        .required("كلمة المرور مطلوبة")
        .max(100, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
});

export default LoginSchema;