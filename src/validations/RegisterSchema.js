import * as yup from "yup";


const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];


const registerSchema = yup.object({
  // ===== PAGE 1 =====
  fullName: yup.string().required("الاسم الكامل مطلوب").max(200, "الاسم الكامل طويل جدًا"),


  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .max(256, "البريد الإلكتروني طويل جدًا"),


  phoneNumber: yup.string().required("رقم الهاتف مطلوب").matches(/^\d{10}$/, "رقم الهاتف يجب أن يكون مكوّن من 10 أرقام فقط"),


  nationalId: yup.string().required("رقم الهوية مطلوب").matches(/^\d{9}$/, "رقم الهوية يجب أن يكون مكونًا من 9 أرقام"),


  city: yup.string().required("المدينة مطلوبة").max(100, "اسم المدينة طويل جدًا"),


  genderSponsor: yup.string().required("الجنس مطلوب").oneOf(["Male", "Female"], "الجنس مطلوب"),


  sponsorDegree: yup.string().required("درجة الكفيل مطلوبة").oneOf(["First", "Second"], "درجة الكفيل مطلوبة"),


  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .min(6, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
    .max(100, "كلمة المرور يجب أن تكون بين 6 و 100 حرف")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,100}$/,
      "كلمة المرور يجب أن تحتوي على حرف كبير وحرف صغير ورقم ورمز (مثل !@#)"
    ),


  // ===== PAGE 2 (مشترك First/Second) =====
  nationalIdElderly: yup.string().when("$step", {
    is: 2,
    then: (s) => s.required("رقم هوية المسن مطلوب").matches(/^\d{9}$/, "رقم هوية المسن يجب أن يكون 9 أرقام"),
    otherwise: (s) => s.notRequired(),
  }),


  kinShip: yup.string().when("$step", {
    is: 2,
    then: (s) => s.required("صلة القرابة مطلوبة"),
    otherwise: (s) => s.notRequired(),
  }),


  degree: yup.string().when("$step", {
    is: 2,
    then: (s) => s.required("الدرجة مطلوبة"),
    otherwise: (s) => s.notRequired(),
  }),


  // ===== فقط للكفيل First (بالصفحة 2) =====
  name: yup.string().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) => s.required("اسم المسن مطلوب"),
    otherwise: (s) => s.notRequired(),
  }),


  doctrine: yup.string().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) => s.required("الديانة مطلوبة"),
    otherwise: (s) => s.notRequired(),
  }),


  maritalStatus: yup.string().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) => s.required("الحالة الاجتماعية مطلوبة"),
    otherwise: (s) => s.notRequired(),
  }),


  cityElderly: yup.string().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) => s.required("مدينة المسن مطلوبة"),
    otherwise: (s) => s.notRequired(),
  }),


  street: yup.string().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) => s.required("الشارع مطلوب"),
    otherwise: (s) => s.notRequired(),
  }),


  healthStatus: yup.string().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) => s.required("الحالة الصحية مطلوبة"),
    otherwise: (s) => s.notRequired(),
  }),


  bDate: yup.string().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) => s.required("تاريخ الميلاد مطلوب"),
    otherwise: (s) => s.notRequired(),
  }),


  reasonRegister: yup.string().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) => s.required("سبب التسجيل مطلوب"),
    otherwise: (s) => s.notRequired(),
  }),


  diseasesText: yup.string().nullable(),


  nationalIdImage: yup.mixed().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) =>
      s
        .required("صورة/ملف هوية المسن مطلوب")
        .test("fileSize", "حجم الملف كبير جدًا (10MB)", (v) => !!v?.[0] && v[0].size <= 10_000_000)
        .test("fileType", "نوع الملف غير مدعوم (JPG/PNG/PDF)", (v) => !!v?.[0] && allowedFileTypes.includes(v[0].type)),
    otherwise: (s) => s.notRequired(),
  }),


  healthInsurance: yup.mixed().when(["$step", "sponsorDegree"], {
    is: (step, deg) => step === 2 && deg === "First",
    then: (s) =>
      s
        .required("التأمين الصحي مطلوب")
        .test("fileSize", "حجم الملف كبير جدًا (10MB)", (v) => !!v?.[0] && v[0].size <= 10_000_000)
        .test("fileType", "نوع الملف غير مدعوم (JPG/PNG/PDF)", (v) => !!v?.[0] && allowedFileTypes.includes(v[0].type)),
    otherwise: (s) => s.notRequired(),
  }),
});


export default registerSchema;

