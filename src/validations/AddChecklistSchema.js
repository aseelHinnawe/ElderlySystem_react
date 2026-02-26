import * as yup from "yup";

const AddChecklistSchema = yup.object({
    elderlyId: yup
        .number()
        .typeError("يرجى اختيار المسن")
        .required("يرجى اختيار المسن"),

    notes: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .max(500, "الملاحظات يجب ألا تتجاوز 500 حرف"),

    temperature: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .max(20, "درجة الحرارة يجب ألا تتجاوز 20 حرف"),

    pulse: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .max(20, "النبض يجب ألا يتجاوز 20 حرف"),

    bloodSugar: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .max(20, "سكر الدم يجب ألا يتجاوز 20 حرف"),

    bloodPressure: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .max(20, "ضغط الدم يجب ألا يتجاوز 20 حرف"),

    intake: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .max(50, "المدخول يجب ألا يتجاوز 50 حرف"),

    output: yup
        .string()
        .trim()
        .nullable()
        .notRequired()
        .max(50, "الإخراج يجب ألا يتجاوز 50 حرف"),
});

export default AddChecklistSchema;