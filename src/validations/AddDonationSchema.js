import * as yup from "yup";

const AddDonationSchema = yup.object({
    donorName: yup
        .string()
        .trim()
        .required("اسم المتبرع مطلوب"),

    donationType: yup
        .string()
        .oneOf(["Cash", "InKind"], "نوع التبرع غير صحيح")
        .required("نوع التبرع مطلوب"),

    monetaryAmount: yup
        .mixed()
        .when("donationType", {
            is: "Cash",
            then: (s) =>
                yup
                    .number()
                    .typeError("المبلغ يجب أن يكون رقم")
                    .positive("المبلغ يجب أن يكون أكبر من صفر")
                    .required("المبلغ مطلوب"),
            otherwise: (s) => s.notRequired(),
        }),

    currency: yup
        .string()
        .when("donationType", {
            is: "Cash",
            then: (s) =>
                yup
                    .string()
                    .trim()
                    .required("العملة مطلوبة")
                    .max(10, "العملة طويلة"),
            otherwise: (s) => s.notRequired(),
        }),

    goods: yup
        .array()
        .when("donationType", {
            is: "InKind",
            then: (s) =>
                s
                    .of(
                        yup.object({
                            nameGood: yup
                                .string()
                                .trim()
                                .required("اسم المنتج مطلوب"),
                            quantity: yup
                                .number()
                                .typeError("الكمية يجب أن تكون رقم")
                                .integer("الكمية يجب أن تكون عدد صحيح")
                                .min(1, "الكمية يجب أن تكون 1 أو أكثر")
                                .required("الكمية مطلوبة"),
                        })
                    )
                    .min(1, "أضف منتج واحد على الأقل")
                    .required("المنتجات مطلوبة"),
            otherwise: (s) => s.notRequired(),
        }),
});

export default AddDonationSchema;