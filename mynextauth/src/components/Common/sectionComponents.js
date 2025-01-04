//frontend/src/components/Common/sectionComponents.js

// Admin Components
import ManageUsers from '../Admin/ManageUsers';
import ManageRoles from '../Admin/ManageRoles';
import UserActivity from '../Admin/UserActivity';
import ArtistReview from '../Admin/ArtistReview';
import ManageProducts from '../Admin/ManageProducts';
import ArtWorkReview from '../Admin/ArtWorkReview';

// SubAdmin Components
import SubUsers from '../SubAdmin/SubUsers';
import SubRoles from '../SubAdmin/SubRoles';
import SubUserActivity from '../SubAdmin/SubUserActivity';
import SubProducts from '../SubAdmin/SubProducts';
import SubInventory from '../SubAdmin/SubInventory';
import ArtworkApproval from '../SubAdmin/ArtworkApproval';
import DeliveryTracking from '../SubAdmin/DeliveryTracking';
import RefundRequests from '../SubAdmin/RefundRequests';

// Artist Components
import UploadNormalArtworks from '../Artist/UploadNormalArtworks';
import ViewStatus from '../Artist/ViewStatus';
import PaymentInfo from '../Artist/PaymentInfo';
import ManagePortfolio from '../Artist/ManagePortfolio';
import KYCComponent from '../Artist/KYCComponent';
import ManageProfile from '../Artist/ManageProfile';

// User Components
import UserProfile from '../User/UserProfile';
import EnrolledCourses from '../User/EnrolledCourses';
import PerformanceAnalytics from '../User/PerformanceAnalytics';
import StudyMaterials from '../User/StudyMaterials';
import Recommendations from '../User/Recommendations';
import Notifications from '../User/Notifications';

// Map sections to components
const sectionComponents = {
    // Admin Sections
    manageUsers: ManageUsers,
    manageRoles: ManageRoles,
    userActivity: UserActivity,
    ArtistReview: ArtistReview,
    manageProducts: ManageProducts,
    ArtWorkReview: ArtWorkReview,

    // SubAdmin Sections
    manageSubUsers: SubUsers,
    manageSubRoles: SubRoles,
    monitorSubUserActivity: SubUserActivity,
    manageSubProducts: SubProducts,
    manageSubInventory: SubInventory,
    approveArtwork: ArtworkApproval,
    trackDelivery: DeliveryTracking,
    handleRefunds: RefundRequests,

    // Artist Sections
    uploadContent: UploadNormalArtworks,
    viewStatus: ViewStatus,
    paymentInfo: PaymentInfo,
    managePortfolio: ManagePortfolio,
    kyc: KYCComponent,
    manageProfile: ManageProfile,

    // User Sections
    profile: UserProfile,
    enrolledCourses: EnrolledCourses,
    performanceAnalytics: PerformanceAnalytics,
    studyMaterials: StudyMaterials,
    recommendations: Recommendations,
    notifications: Notifications,
};

export default sectionComponents;
