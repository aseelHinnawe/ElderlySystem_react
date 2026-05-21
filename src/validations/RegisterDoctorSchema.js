
import * as yup from "yup";

const doctorUniversitySchema = yup.object({
    universityName: yup
        .string()
        .trim()
        .required("اسم الجامعة مطلوب")
        .max(150, "اسم الجامعة طويل جدًا"),


    degree: yup
        .number()
        .transform((val, originalVal) => {
            if (
                originalVal === "" ||
                originalVal === null ||
                originalVal === undefined
            )
                return undefined;
            return Number(originalVal);
        })
        .oneOf([1, 2, 3], "الدرجة العلمية مطلوبة")
        .required("الدرجة العلمية مطلوبة"),
});


const requiredStringArray = (itemLabel) =>
    yup.array().when("$step", {
        is: 2,
        then: () =>
            yup
                .array()
                .of(yup.string().trim().required(`${itemLabel} مطلوب`))
                .min(1, `أدخل ${itemLabel} واحدًا على الأقل`)
                .test("has-value", `أدخل ${itemLabel} واحدًا على الأقل`, (arr) =>
                    Array.isArray(arr) && arr.some((x) => String(x || "").trim() !== "")
                ),
        otherwise: () => yup.array().notRequired().default([]),
    });




const optionalStringArray = (itemLabel) =>
    yup.array().when("$step", {
        is: 2,
        then: () =>
            yup
                .array()
                .of(yup.string().trim().max(150, `${itemLabel} طويل جدًا`))
                .default([]),
        otherwise: () => yup.array().notRequired().default([]),
    });




const RegisterDoctorSchema = yup.object({
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



    city: yup.string().required("المدينة مطلوبة").max(100, "اسم المدينة طويل جدًا"),


    nationalId: yup
        .string()
        .required("رقم الهوية مطلوب")
        .matches(/^\d{9}$/, "رقم الهوية يجب أن يتكون من 9 أرقام"),


    genderDoctor: yup
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


    medicalRank: yup.string().when("$step", {
        is: 2,
        then: (s) =>
            s.required("الرتبة الطبية مطلوبة").max(100, "الرتبة الطبية طويلة جدًا"),
        otherwise: (s) => s.notRequired(),
    }),


    yearsOfExperience: yup.string().when("$step", {
        is: 2,
        then: (s) =>
            s.required("سنوات الخبرة مطلوبة").max(50, "قيمة سنوات الخبرة طويلة جدًا"),
        otherwise: (s) => s.notRequired(),
    }),



    doctorBDate: yup.string().when("$step", {
        is: 2,
        then: (s) =>
            s
                .required("تاريخ الميلاد مطلوب")
                .test("not-future", "تاريخ الميلاد غير صحيح", (value) => {
                    if (!value) return false;
                    return new Date(value) <= new Date();
                }),
        otherwise: (s) => s.notRequired(),
    }),


    specializations: requiredStringArray("تخصص"),
    workPlaces: requiredStringArray("مكان عمل"),

    universities: yup.array().when("$step", {
        is: 2,
        then: () =>
            yup
                .array()
                .of(doctorUniversitySchema)
                .min(1, "يجب إدخال جامعة واحدة على الأقل")
                .required("الجامعات مطلوبة"),
        otherwise: () => yup.array().notRequired().default([]),
    }),
});


export default RegisterDoctorSchema;


