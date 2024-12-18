import { Routes, Route } from "react-router-dom";
import * as Pages from "../../pages";
import { MainLayout } from "./MainLayout";
import { TrainerLayout } from "./trainer/TrainerLayout";

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Pages.Login />} />
      <Route path="/forgot-password" element={<Pages.ForgotPassword />} />
      <Route path="/verify-otp" element={<Pages.VerifyOtp />} />
      <Route
        path="/create-new-password"
        element={<Pages.CreateNewPassword />}
      />
      {/* File Details */}
      <Route path="/fileDetails/:fileName" element={<Pages.ViewFile />} />

      {/* Trainer Auth Routes */}
      <Route path="/trainer/login" element={<Pages.TrainerLogin />} />

      <Route
        path="/trainer/forgot-password"
        element={<Pages.TrainerForgotPassword />}
      />
      <Route path="/trainer/verify-otp" element={<Pages.TrainerVerifyOtp />} />
      <Route
        path="/trainer/create-new-password"
        element={<Pages.TrainerCreateNewPassword />}
      />

      {/* Main Layout or other routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Pages.Home />} />
        {/* KYC Documents */}
        <Route path="/kycDocuments/add" element={<Pages.AddKycDocument />} />
        <Route
          path="/kycDocuments/edit/:id"
          element={<Pages.EditKycDocument />}
        />
        <Route path="/kycDocuments" element={<Pages.KycDocumentList />} />

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
        <Route
          path="/newsletters/edit/:id"
          element={<Pages.EditNewsletter />}
        />
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
        <Route
          path="/trainerInterests"
          element={<Pages.TrainerInterestList />}
        />

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

        {/* Plan Type */}
        <Route path="/planTypes/add" element={<Pages.AddPlanType />} />
        <Route path="/planTypes/edit/:id" element={<Pages.EditPlanType />} />
        <Route path="/planTypes" element={<Pages.PlanTypeList />} />

        {/* Plan */}
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
        <Route
          path="/trainers/details/:id"
          element={<Pages.TrainerDetails />}
        />

        {/* Users */}
        <Route path="/users/add" element={<Pages.AddUser />} />
        <Route path="/users/edit/:id" element={<Pages.EditUser />} />
        <Route path="/users" element={<Pages.UserList />} />
        <Route path="/users/details/:id" element={<Pages.UserDetails />} />
        <Route
          path="/users/booking/planDetails/:id"
          element={<Pages.UserBookingPlanDetails />}
        />

        {/* Programs */}
        <Route path="/programs/add" element={<Pages.AddProgram />} />
        <Route path="/programs/edit/:id" element={<Pages.EditProgram />} />
        <Route path="/programs" element={<Pages.ProgramList />} />
        <Route
          path="/programs/details/:id"
          element={<Pages.ProgramDetails />}
        />

        {/* Bookings */}
        <Route path="/bookings/add" element={<Pages.AddBooking />} />
        <Route path="/bookings/edit/:id" element={<Pages.EditBooking />} />
        <Route path="/bookings" element={<Pages.BookingList />} />
        <Route
          path="/bookings/details/:id"
          element={<Pages.BookingDetails />}
        />

        {/* Program Plans */}
        <Route
          path="/programPlans/add/:id"
          element={<Pages.AddProgramPlan />}
        />
        <Route
          path="/programPlans/edit/:id"
          element={<Pages.EditProgramPlan />}
        />
        <Route path="/programPlans" element={<Pages.ProgramPlanList />} />
        <Route
          path="/programPlans/details/:id"
          element={<Pages.ProgramPlanDetails />}
        />

        {/* Golas */}
        <Route path="/goals/add" element={<Pages.AddGoal />} />
        <Route path="/goals/edit/:id" element={<Pages.EditGoal />} />
        <Route path="/goals" element={<Pages.GoalList />} />

        {/* Age Ranges */}
        <Route path="/ageRanges/add" element={<Pages.AddAgeRange />} />
        <Route path="/ageRanges/edit/:id" element={<Pages.EditAgeRange />} />
        <Route path="/ageRanges" element={<Pages.AgeRangeList />} />

        {/* Yoga Experiences */}
        <Route
          path="/yogaExperiences/add"
          element={<Pages.AddYogaExperience />}
        />
        <Route
          path="/yogaExperiences/edit/:id"
          element={<Pages.EditYogaExperience />}
        />
        <Route path="/yogaExperiences" element={<Pages.YogaExperienceList />} />

        {/* Time Slots */}
        <Route path="/timeSlots/add" element={<Pages.AddTimeSloat />} />
        <Route path="/timeSlots/edit/:id" element={<Pages.EditTimeSloat />} />
        <Route path="/timeSlots" element={<Pages.TimeSloatList />} />

        {/* Budgets */}
        <Route path="/budgets/add" element={<Pages.AddBudget />} />
        <Route path="/budgets/edit/:id" element={<Pages.EditBudget />} />
        <Route path="/budgets" element={<Pages.BudgetList />} />
      </Route>

      {/* Trainer Routes */}
      <Route path="/trainer" element={<TrainerLayout />}>
        {/* Dashboard */}
        <Route path="/trainer" element={<Pages.TrainerDashboard />} />
        <Route path="/trainer/profile" element={<Pages.TrainerProfile />} />
        <Route
          path="/trainer/updateProfile"
          element={<Pages.UpdateTrainerProfile />}
        />

        {/* Bookings */}
        <Route
          path="/trainer/bookings"
          element={<Pages.TrainerBookingList />}
        />

        <Route
          path="/trainer/bookings/details/:id"
          element={<Pages.TrainerBookingDetails />}
        />

        {/* Users */}
        <Route path="/trainer/users" element={<Pages.TrainersUserList />} />
        <Route
          path="/trainer/users/details/:id"
          element={<Pages.TrainerUserDetails />}
        />

        <Route
          path="/trainer/bookings/details/:id"
          element={<Pages.TrainerBookingDetails />}
        />
      </Route>
    </Routes>
  );
}
