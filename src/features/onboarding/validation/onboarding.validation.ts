import * as Yup from "yup";

export const onboardingValidationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "onboarding:validation.firstNameTooShort")
    .required("onboarding:validation.firstNameRequired"),
  middleName: Yup.string(),
  lastName: Yup.string()
    .min(2, "onboarding:validation.lastNameTooShort")
    .required("onboarding:validation.lastNameRequired"),
  birthday: Yup.date()
    .max(new Date(), "onboarding:validation.birthdayInvalid")
    .required("onboarding:validation.birthdayRequired"),
  gender: Yup.string().required("onboarding:validation.genderRequired"),
});

export const onboardingInitialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  birthday: "",
  gender: "",
};
