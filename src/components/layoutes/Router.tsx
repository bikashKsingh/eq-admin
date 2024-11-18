import { Routes, Route } from "react-router-dom";
import * as Pages from "../../pages";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Pages.Home />} />
      <Route path="/login" element={<Pages.Login />} />
      <Route path="/forgot-password" element={<Pages.ForgotPassword />} />
      <Route path="/verify-otp" element={<Pages.VerifyOtp />} />
      <Route
        path="/create-new-password"
        element={<Pages.CreateNewPassword />}
      />
      {/* Payment Settings */}
      <Route
        path="/paymentSettings/add"
        element={<Pages.AddPaymentSetting />}
      />
      <Route
        path="/paymentSettings/edit/:id"
        element={<Pages.EditPaymentSetting />}
      />
      <Route path="/paymentSettings" element={<Pages.PaymentSettingList />} />

      {/* Category */}
      <Route path="/categories/add" element={<Pages.AddCategory />} />
      <Route path="/categories/edit/:id" element={<Pages.EditCategory />} />
      <Route path="/categories" element={<Pages.CategoryList />} />

      {/* Sub Category */}
      <Route path="/subCategories/add" element={<Pages.AddSubCategory />} />
      <Route
        path="/subCategories/edit/:id"
        element={<Pages.EditSubCategory />}
      />
      <Route path="/subCategories" element={<Pages.SubCategoryList />} />

      {/* Newsletters */}
      <Route path="/newsletters/add" element={<Pages.AddNewsletter />} />
      <Route path="/newsletters/edit/:id" element={<Pages.EditNewsletter />} />
      <Route path="/newsletters" element={<Pages.NewsletterList />} />

      {/* Coupons */}
      <Route path="/coupons/add" element={<Pages.AddCoupon />} />
      <Route path="/coupons/edit/:id" element={<Pages.EditCoupon />} />
      <Route path="/coupons" element={<Pages.CouponList />} />

      {/* Document Format */}
      <Route
        path="/documentFormats/add"
        element={<Pages.AddDocumentFormat />}
      />
      <Route
        path="/documentFormats/edit/:id"
        element={<Pages.EditDocumentFormat />}
      />
      <Route path="/documentFormats" element={<Pages.DocumentFormatList />} />

      {/* KYC Documents */}
      <Route path="/kycDocuments/add" element={<Pages.AddKycDocument />} />
      <Route
        path="/kycDocuments/edit/:id"
        element={<Pages.EditKycDocument />}
      />
      <Route path="/kycDocuments" element={<Pages.KycDocumentList />} />

      {/* Trainer Speciality */}
      <Route
        path="/trainerSpecialities/add"
        element={<Pages.AddTrainerSpeciality />}
      />
      <Route
        path="/trainerSpecialities/edit/:id"
        element={<Pages.EditTrainerSpeciality />}
      />
      <Route
        path="/trainerSpecialities"
        element={<Pages.TrainerSpecialityList />}
      />

      {/* Trainer Interest */}
      <Route
        path="/trainerInterests/add"
        element={<Pages.AddTrainerInterest />}
      />
      <Route
        path="/trainerInterests/edit/:id"
        element={<Pages.EditTrainerInterest />}
      />
      <Route path="/trainerInterests" element={<Pages.TrainerInterestList />} />

      {/* Trainer Level */}
      <Route path="/trainerLevels/add" element={<Pages.AddTrainerLevel />} />
      <Route
        path="/trainerLevels/edit/:id"
        element={<Pages.EditTrainerLevel />}
      />
      <Route path="/trainerLevels" element={<Pages.TrainerLevelList />} />

      {/* Program Requirements */}
      <Route
        path="/programRequirements/add"
        element={<Pages.AddProgramRequirement />}
      />
      <Route
        path="/programRequirements/edit/:id"
        element={<Pages.EditProgramRequirement />}
      />
      <Route
        path="/programRequirements"
        element={<Pages.ProgramRequirementList />}
      />

      {/* Program Durations */}
      <Route path="/plans/add" element={<Pages.AddPlan />} />
      <Route path="/plans/edit/:id" element={<Pages.EditPlan />} />
      <Route path="/plans" element={<Pages.PlanList />} />

      {/* Program Requirements */}
      <Route
        path="/trainerDesignations/add"
        element={<Pages.AddTrainerDesignation />}
      />
      <Route
        path="/trainerDesignations/edit/:id"
        element={<Pages.EditTrainerDesignation />}
      />
      <Route
        path="/trainerDesignations"
        element={<Pages.TrainerDesignationList />}
      />

      {/* Trainers */}
      <Route path="/trainers/add" element={<Pages.AddTrainer />} />
      <Route path="/trainers/edit/:id" element={<Pages.EditTrainer />} />
      <Route path="/trainers" element={<Pages.TrainerList />} />
      <Route path="/trainers/details/:id" element={<Pages.TrainerDetails />} />

      {/* Users */}
      <Route path="/users/add" element={<Pages.AddUser />} />
      <Route path="/users/edit/:id" element={<Pages.EditUser />} />
      <Route path="/users" element={<Pages.UserList />} />
      <Route path="/users/details/:id" element={<Pages.UserDetails />} />

      {/* Programs */}
      <Route path="/programs/add" element={<Pages.AddProgram />} />
      <Route path="/programs/edit/:id" element={<Pages.EditProgram />} />
      <Route path="/programs" element={<Pages.ProgramList />} />
      <Route path="/programs/details/:id" element={<Pages.ProgramDetails />} />

      {/* Program Plans */}
      <Route path="/programPlans/add/:id" element={<Pages.AddProgramPlan />} />
      <Route
        path="/programPlans/edit/:id"
        element={<Pages.EditProgramPlan />}
      />
      <Route path="/programPlans" element={<Pages.ProgramPlanList />} />
      <Route
        path="/programPlans/details/:id"
        element={<Pages.ProgramPlanDetails />}
      />

      {/* File Details */}
      <Route path="/fileDetails/:fileName" element={<Pages.ViewFile />} />
    </Routes>
  );
}
