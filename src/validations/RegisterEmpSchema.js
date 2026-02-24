import * as yup from "yup";

const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

const workExperienceSchema = yup.object({
  workName: yup.string().trim().required("اسم مكان العمل مطلوب"),
  workLocation: yup.string().trim().required("موقع العمل مطلوب"),
  jobTitle: yup.string().trim().required("المسمى الوظيفي مطلوب"),
});

const RegisterEmpSchema = yup.object({
  fullName: yup.string().required("الاسم الكامل مطلوب").max(200, "الاسم الكامل طويل جدًا"),

  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .max(256, "البريد الإلكتروني طويل جدًا"),

  phoneNumber: yup.string().required("رقم الهاتف مطلوب").matches(/^\d{10}$/, "رقم الهاتف يجب أن يتكون من 10 أرقام"),

  city: yup.string().required("المدينة مطلوبة").max(100, "اسم المدينة طويل جدًا"),

  nationalId: yup.string().required("رقم الهوية مطلوب").matches(/^\d{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام"),

  gender: yup.string().required("الجنس مطلوب").oneOf(["Male", "Female"], "الجنس مطلوب"),

  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
    .max(100, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,100}$/,
      "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز (مثل !@#)"
    ),

  certificate: yup.mixed().when("$step", {
    is: 2,
    then: (s) =>
      s
        .required("الشهادة مطلوبة")
        .test("fileSize", "حجم الملف كبير جدًا (أقصى 10 ميغابايت)", (v) => {
          const f = v?.[0];
          return !!f && f.size <= 10_000_000;
        })
        .test("fileType", "نوع الملف غير مدعوم (JPG/PNG/PDF)", (v) => {
          const f = v?.[0];
          return !!f && allowedFileTypes.includes(f.type);
        }),
    otherwise: (s) => s.notRequired(),
  }),

  educationLevel: yup.string().when("$step", {
    is: 2,
    then: (s) => s.required("المستوى التعليمي مطلوب"),
    otherwise: (s) => s.notRequired(),
  }),

  nurseMaritalStatus: yup.string().when("$step", {
    is: 2,
    then: (s) => s.required("الحالة الاجتماعية مطلوبة"),
    otherwise: (s) => s.notRequired(),
  }),

  fieldOfStudy: yup.string().when("$step", {
    is: 2,
    then: (s) => s.required("مجال الدراسة مطلوب").max(100, "مجال الدراسة يجب ألا يزيد عن 100 حرف"),
    otherwise: (s) => s.notRequired(),
  }),

  yearsOfStudy: yup
    .number()
    .transform((val, originalVal) => {
      if (originalVal === "" || originalVal === null || originalVal === undefined) return undefined;
      return Number(originalVal);
    })
    .when("$step", {
      is: 2,
      then: (s) =>
        s
          .typeError("عدد سنوات الدراسة يجب أن يكون رقم")
          .min(0, "عدد سنوات الدراسة يجب أن يكون بين 0 و 20")
          .max(20, "عدد سنوات الدراسة يجب أن يكون بين 0 و 20")
          .required("عدد سنوات الدراسة مطلوب"),
      otherwise: (s) => s.notRequired(),
    }),

  yearOfGraduation: yup.string().when("$step", {
    is: 2,
    then: (s) => s.required("سنة التخرج مطلوبة").matches(/^\d{4}$/, "سنة التخرج يجب أن تكون 4 أرقام مثل 2022"),
    otherwise: (s) => s.notRequired(),
  }),

  workExperiences: yup.array().of(workExperienceSchema).default([]),
});

export default RegisterEmpSchema;