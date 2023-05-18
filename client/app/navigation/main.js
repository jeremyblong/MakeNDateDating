import React, { useCallback } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { useSelector, connect } from 'react-redux';
import {BaseColor, useTheme, useFont} from '@config';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components';
import _ from "lodash";
import ViewNearbyUsersMapView from "@screens/NearbyUsers/nearbyUsers.js";
import Profile1 from '@screens/Profile1';
import PasswordConfirmationShow from "../screens/Auth/PasswordRecovery/confirmationView/viewConfirmation.js";
// import Profile2 from '@screens/Profile2';
// import Profile3 from '@screens/Profile3';
// import Profile4 from '@screens/Profile4';
// import Profile5 from '@screens/Profile5';
// import Profile6 from '@screens/Profile6';
// import Profile7 from '@screens/Profile7';
// import Profile8 from '@screens/Profile8';
import More from '@screens/More';
import Tour from '@screens/Tour';
import Car from '@screens/Car';
import OverViewCar from '@screens/OverViewCar';
import Hotel from '@screens/Hotel';
import Review from '@screens/Review';
import Feedback from '@screens/Feedback';
import Messages from '@screens/Messages';
import Notification from '@screens/Notification';
import Walkthrough from '@screens/Walkthrough';
import SignUp from '@screens/SignUp';
import SignIn from '@screens/SignIn';
import ResetPassword from '@screens/ResetPassword';
import ChangePassword from '@screens/ChangePassword';
import ProfileEdit from '@screens/ProfileEdit';
import ProfileExample from '@screens/ProfileExample';
import ChangeLanguage from '@screens/ChangeLanguage';
import HotelInformation from '@screens/HotelInformation';
import CheckOut from '@screens/CheckOut';
import Currency from '@screens/Currency';
import Coupons from '@screens/Coupons';
import HotelDetail from '@screens/HotelDetail';
import PreviewBooking from '@screens/PreviewBooking';
import PricingTable from '@screens/PricingTable';
import PricingTableIcon from '@screens/PricingTableIcon';
import BookingDetail from '@screens/BookingDetail';
import PostDetail from '@screens/PostDetail';
import TourDetail from '@screens/TourDetail';
import CarDetail from '@screens/CarDetail';
import AboutUs from '@screens/AboutUs';
import OurService from '@screens/OurService';
import FlightSearch from '@screens/FlightSearch';
import SelectFlight from '@screens/SelectFlight';
import FlightResult from '@screens/FlightResult';
import FlightSummary from '@screens/FlightSummary';
import FlightTicket from '@screens/FlightTicket';
import CruiseSearch from '@screens/CruiseSearch';
// import Cruise from '@screens/Cruise';
import CruiseDetail from '@screens/CruiseDetail';
// import BusSearch from '@screens/BusSearch';
import BusList from '@screens/BusList';
import BusSelectSeat from '@screens/BusSelectSeat';
import PreviewBusBooking from '@screens/PreviewBusBooking';
import BusTicket from '@screens/BusTicket';
import Event from '@screens/Event';
import EventDetail from '@screens/EventDetail';
import EventPreviewBooking from '@screens/EventPreviewBooking';
import DashboardEvent from '@screens/DashboardEvent';
import EventTicket from '@screens/EventTicket';
import PaymentMethod from '@screens/PaymentMethod';
import MyPaymentMethod from '@screens/MyPaymentMethod';
import AddPayment from '@screens/AddPayment';
import PaymentMethodDetail from '@screens/PaymentMethodDetail';
import PreviewPayment from '@screens/PreviewPayment';
import Setting from '@screens/Setting';
import ThemeSetting from '@screens/ThemeSetting';
import NotFound from '@screens/NotFound';
import Home from '@screens/Home';
import Booking from '@screens/Booking';
import Messenger from '@screens/Messenger';
import Profile from '@screens/Profile';
import RegisterScreen from "@screens/Auth/RegisterScreen.js";
import ManageUploadProfilePictures from "../mainScreens/Profile/ManagePhotos/manageUploadImages.js";
import Geolocation from '@react-native-community/geolocation';
import axios from "axios";
import { BASE_URL } from "@env";
import EditProfileScreen from "../mainScreens/EditProfile/editProfileScreen.js";
import HeightHelperComponent from "../mainScreens/EditProfile/helpers/functionsHelpers/Height/heightComponent.js";
import OccupationAssistingHelper from "../mainScreens/EditProfile/helpers/functionsHelpers/Occupation/index.js";
import EducationalDataChanger from "../mainScreens/EditProfile/helpers/functionsHelpers/Education/index.js";
import BiographyAboutMeInterestsHelper from "../mainScreens/EditProfile/helpers/functionsHelpers/AboutAndInterests/index.js";
import EventDetailsCustom from "../mainScreens/EventsMeetups/IndividualMeetupView/index.js";
import ProfilePromptsEditModify from "../mainScreens/EditProfile/helpers/functionsHelpers/ProfilePrompts/index.js";
import CreateANewMeetupForm from "../mainScreens/EventsMeetups/CreateNewMeetup/createNewMeetup.js";
import LiveStreamingDisplaySelectionPage from "../mainScreens/LiveStreaming/Home/index.js";
import CreateNewLiveStream from "../mainScreens/LiveStreaming/Create/index.js";
import ViewIndividualStartLiveStream from "../mainScreens/LiveStreaming/IndividualStream/index.js";
import PostNewIndividualFeedItem from "../mainScreens/Feed/PostNew/postNewFeedItem.js";
import RenderIndividualViewPagePostFeed from "../screens/Booking/IndividualView/index.js";
import InitiateVerificationFlowKYC from "../screens/Auth/VerifyAccount/initiateVerificationFlow.js";
import ListNewItemSaleClothing from "../mainScreens/Ecommerce/ListClothingItemSale/listItem.js";
import OneVOneChatRandomized from "../mainScreens/OneVOneChat/randomizedChatHomepage.js";
import RegisterTherapistCompanionScreen from "../screens/Auth/RegisterNewTherapist.js";
import EnrollmentStartProcess from "../screens/EventDetail/EnrolllmentProcess/enrollment.js";
import ViewCompanionshipRequests from "../mainScreens/Mentorship/ViewMentorshipRequests/viewRequests.js";
import InitiateBackgroundSecurityCheckProcess from "../screens/Auth/backgroundCheck/initiateBackgroundCheck.js";
import ViewPromotionalOptionsViewMain from "../mainScreens/PromotionalRelated/promotionsMain.js";
import PromoteAccountPersonal from "../mainScreens/PromotionalRelated/promoteAccount/promote.js";
import SecurityLogsListRenderHelper from "../mainScreens/SecurityLogs/viewSecurityLogsMain.js";
import ViewIndividualMentorshipRequest from "../mainScreens/Mentorship/ViewMentorshipRequests/Individual/viewIndividualRequest.js";
import LeaveAReviewMeetupGroup from "../screens/HotelDetail/Review/reviewMeetupExp.js";
import ManageActiveAppointsmentsMentorship from "../mainScreens/Mentorship/ActiveMentorshipping/ViewMainActiveManagementView/activeMentorshipManagementMain.js";
import IndividualViewContractDetails from "../mainScreens/Mentorship/ActiveMentorshipping/Individual/viewIndividualContract.js";
import StripeOnboardingFlowProcess from "../mainScreens/Payment/Onboarding/main.js";
import InitiateIndividualGroupChatCategorical from "../mainScreens/CategoricalChat/initiateChat.js";
import OneVOneChatRandomizedIndividualView from "../mainScreens/OneVOneChat/individual/individualView.js";
import HairColorComponentHelper from "../mainScreens/EditProfile/helpers/functionsHelpers/HairColor/updateHair.js";
import NumberOfChildrenHelperComponent from "../mainScreens/EditProfile/helpers/functionsHelpers/ChildrenCount/numOfChildren.js";
import MatchesListMain from "../mainScreens/Matches/main.js";
import MatchInteractionsListMain from "../mainScreens/Matches/Interactions/matchInteractions.js";
import BlockingPrivacyMainPage from "../mainScreens/PrivacyBlocking/mainView.js";
import FreeDailyLotterySpin from "../mainScreens/LotteryScratcher/mainScreen.js";
import ReglionSelectionHelper from "../mainScreens/EditProfile/helpers/functionsHelpers/Religon/index.js";
import OrganizeMeetupsBetweenParties from "../mainScreens/Matches/OrganizeMeetup/organize.js";
import ManageIndividualMeetupRequestFromNotification from "../mainScreens/Matches/OrganizeMeetup/individualNotificationView/individual.js";
import ViewManagePersonalMeetups from "../mainScreens/Matches/MeetupRelated/viewListMeetups.js";
import ContactUs from "../screens/ContactUs/index.js";
import OpenNewSupportTicketClaim from "../mainScreens/OpenSupportTicket/newTicket.js";
import LiveStreaming1v1Mentorship from "../mainScreens/Mentorship/LiveStreaming1v1/index.js";
import ListViewCommerceMain from "../mainScreens/Ecommerce/ListViewMain/listView.js";
import IndividualClothingCommerceView from "../mainScreens/Ecommerce/IndividualView/individualListing.js";
import ManageSalesListViewMain from "../mainScreens/Ecommerce/SoldSales/MainViewList/viewListOfSales.js";
import MyPaymentMethodHomepage from "../screens/PaymentMethodsHome/index.js";
import ViewMainMeetupListNearby from "../mainScreens/MeetupsNearby/viewMainMeetupsView.js";
import MarkCompletedMentorshipContract from "../mainScreens/Mentorship/CompleteContract/complete.js";
import ViewIndividualStartLiveStreamChatBetweenUsers from "../mainScreens/Matches/Interactions/VideoChatUsers/videoChat.js";
import MusicAnthemMainProfileEdit from "../mainScreens/EditProfile/helpers/functionsHelpers/MusicAnthem/selectMusicAnthem.js";
import ChatGPTSuggestionsMainView from "../mainScreens/ChatGPTSuggestions/Main/mainChatSuggestionsView.js";
import PreviewImagesProfile from "../screens/Profile1/ViewImages/images.js";
import ViewRestrictedImagesOnly from "../screens/Profile1/ViewRestrictedImages/restrictedImages.js";
import IntroductoryVideoMainHelper from "../mainScreens/EditProfile/helpers/functionsHelpers/ProfileVideoAbout/videoUpdate.js";
import PrivacyPolicyMain from "../mainScreens/Policies/PrivacyPolicy/index.js";
import TermsOfUserDisplay from "../mainScreens/Policies/TermsOfUse/index.js";
import ViewAllFollowersProfileViewMore from "../screens/Profile1/FollowingFollowers/Followers/FullView/viewAllFollowersProfile.js";
import ViewProfileViewIndividualProfilewViewsOwn from "../mainScreens/Profile/ViewProfileViews/viewPreviousViews.js";
import PayToRemoveProfileViewHistoryHelper from "../mainScreens/Profile/HideProfileViews/hideViews.js";
import BacheloretteMainViewHomepage from "../mainScreens/Bachelorette/ViewMainView/mainView.js";
import CreateNewBacheloretteListingGame from "../mainScreens/Bachelorette/InitiateNewGame/createNewListingGame.js";
import BacheloretteConfirmationAboutPageComponent from "../mainScreens/Bachelorette/Informational/viewAdditionalInfo.js";
import MainBachelorBacheloretteMenuNav from "../mainScreens/Bachelorette/MenuNav/mainNav.js";
import ViewManageActiveSessionsBacheloretteBachelorHelper from "../mainScreens/Bachelorette/ManageCompetition/ViewCompetitionsActive/viewActive.js";
import IndividualGameCompetitionView from "../mainScreens/Bachelorette/ManageCompetition/individualView/viewIndividualInfo.js";
import QuestionareBachelorBacheloretteComponent from "../mainScreens/Bachelorette/RoundsGame/PersonalityTestRound/testMain.js";
import ViewQuestionareResultsSubmitted from "../mainScreens/Bachelorette/RoundsGame/PersonalityTestRound/ViewResults/view.js";
import InAppGameVideoCallingHelper from "../mainScreens/Bachelorette/RoundsGame/roundThreeVideo/manageRoundThree.js";
import InAppGameCompetitionSubmitTalentVideoHelper from "../mainScreens/Bachelorette/ManageCompetition/TalentShow/submitTalentShowVideo.js";
import { Image } from "react-native";


const MainStack = createStackNavigator(); 
const BottomTab = createBottomTabNavigator();

const Main = ({ authenticatedData }) => {

  const navigation = useNavigation();
  const { colors, theme } = useTheme();
  const colorSchemeDark = theme.dark;

  useFocusEffect(
    useCallback(async () => {
      // set default dark theming..
      if (_.has(authenticatedData, "uniqueId")) {
        Geolocation.getCurrentPosition(info => {
          
          const { latitude, longitude } = info.coords;
          const location = { latitude, longitude, latitudeDelta: 0.00875, longitudeDelta: 0.00875 };
          const config = {
            location,
            userID: authenticatedData.uniqueId
          };
    
          axios.post(`${BASE_URL}/update/partially/randomize/user/public/location`, config).then((res) => {
              
              const { updated, message } = res.data;
    
              if (updated === true && message === "Successfully updated user's current approx location!") {
    
                  console.log("ressssssss location (current) data:", res.data);
              } else {
                  console.log("err", res.data);
              }
          }).catch((err) => {
              console.log("err", err);
          });
        });
      }
  }, []));

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="BottomTabNavigator"
    >
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <MainStack.Screen name="RegisterNewAccount" options={{ gestureEnabled: false }} component={RegisterScreen} />
      <MainStack.Screen name="CommerceClothingMainView" component={ListViewCommerceMain} />
      <MainStack.Screen name="IndividualClothingItemListing" component={IndividualClothingCommerceView} />
      <MainStack.Screen name="ListClothingItemForSale" component={ListNewItemSaleClothing} />
      <MainStack.Screen name="ManageUploadRearrangeProfileImages" component={ManageUploadProfilePictures} />
      <MainStack.Screen name="EditProfileMain">
        {props => <EditProfileScreen navigation={navigation} props={props} colorSchemeDark={colorSchemeDark} />}
      </MainStack.Screen>
      <MainStack.Screen name="HeightProfileDataEdit" component={HeightHelperComponent} />
      <MainStack.Screen name="OccupationalSettingsProfile" component={OccupationAssistingHelper} />
      <MainStack.Screen name="EducationalSettingsProfile" component={EducationalDataChanger} />
      <MainStack.Screen name="BiographyAndInterestsEdit" component={BiographyAboutMeInterestsHelper} />
      <MainStack.Screen name="EventIndividualView" component={EventDetailsCustom} />
      <MainStack.Screen name="ProfilePromptsEditModify" component={ProfilePromptsEditModify} />
      <MainStack.Screen name="CreateNewGroupMeetup" component={CreateANewMeetupForm} />
      <MainStack.Screen name="LiveStreamingHomepage" component={LiveStreamingDisplaySelectionPage} />
      <MainStack.Screen name="CreateNewLiveStream" component={CreateNewLiveStream} />
      <MainStack.Screen name="LiveStreamFeedIndividual" component={ViewIndividualStartLiveStream} />
      <MainStack.Screen name="PostNewFeedItems" component={PostNewIndividualFeedItem} />
      <MainStack.Screen name="ViewIndividualFeedItem" component={RenderIndividualViewPagePostFeed} />
      <MainStack.Screen name="VerifyAuthAccountPlaid" component={InitiateVerificationFlowKYC} />
      <MainStack.Screen name="OneVOneChatRandom" component={OneVOneChatRandomized} />
      <MainStack.Screen name="RegisterTherapistAccountType" options={{ gestureEnabled: false }} component={RegisterTherapistCompanionScreen} />
      <MainStack.Screen name="EnrollmentCompanionMentorStartProcess" component={EnrollmentStartProcess} />
      <MainStack.Screen name="ViewTherapyCompanionshipRequests" component={ViewCompanionshipRequests} />
      <MainStack.Screen name="VerifyAccountBackgroundCheckInitiate" component={InitiateBackgroundSecurityCheckProcess} />
      <MainStack.Screen name="PromotionalOptionsMainView" component={ViewPromotionalOptionsViewMain} />
      <MainStack.Screen name="PromoteIndividualAccountPage" component={PromoteAccountPersonal} />
      <MainStack.Screen name="AuthenticationSecurityLogs" component={SecurityLogsListRenderHelper} />
      <MainStack.Screen name="ViewIndividualTherapyMentorshipRequest" component={ViewIndividualMentorshipRequest} />
      <MainStack.Screen name="LeaveAReviewMeetupGroupScreen" component={LeaveAReviewMeetupGroup} />
      <MainStack.Screen name="ManageActiveAppointmentMeetingsMain" component={ManageActiveAppointsmentsMentorship} />
      <MainStack.Screen name="ViewIndividualContractMentorshipManagement" component={IndividualViewContractDetails} />
      <MainStack.Screen name="JoinSpecificChatChannelSelection" component={InitiateIndividualGroupChatCategorical} />
      <MainStack.Screen name="OneVOneChatRandomizedIndividual" component={OneVOneChatRandomizedIndividualView} />
      <MainStack.Screen name="EditHairColorProfileData" component={HairColorComponentHelper} />
      <MainStack.Screen name="ChildrenCountParentingPage" component={NumberOfChildrenHelperComponent} />
      <MainStack.Screen name="Matches" component={MatchesListMain} />
      <MainStack.Screen name="MatchInteractionsList" component={MatchInteractionsListMain} />
      <MainStack.Screen name="PrivacySettingsBlocking" component={BlockingPrivacyMainPage} />
      <MainStack.Screen name="DailyFreeSpinLottery" component={FreeDailyLotterySpin} />
      <MainStack.Screen name="RegigonSelectionProfile" component={ReglionSelectionHelper} />
      <MainStack.Screen name="OrganizeLocalMeetupBetweenMatches" component={OrganizeMeetupsBetweenParties} />
      <MainStack.Screen name="NotificationMeetupRequestIndividual" component={ManageIndividualMeetupRequestFromNotification} />
      <MainStack.Screen name="MeetupDataListMain" component={ViewManagePersonalMeetups} />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="OpenSupportTicket" component={OpenNewSupportTicketClaim} />
      <MainStack.Screen name="LiveStreamingMentorship" component={LiveStreaming1v1Mentorship} />
      <MainStack.Screen name="ViewManageAllSalesPendingSold" component={ManageSalesListViewMain} />
      <MainStack.Screen name="PaymentMethodHomepage" component={MyPaymentMethodHomepage} />
      <MainStack.Screen name="StripeOnboardingFlow" component={StripeOnboardingFlowProcess} />
      <MainStack.Screen name="ViewAllMeetupsNearby" component={ViewMainMeetupListNearby} />
      <MainStack.Screen name="CompletionMentorshipContractingRequests" component={MarkCompletedMentorshipContract} />
      <MainStack.Screen name="MusicAnthemProfile" component={MusicAnthemMainProfileEdit} />
      <MainStack.Screen name="ChatGPTSuggestionsMain" component={ChatGPTSuggestionsMainView} />
      <MainStack.Screen name="PreviewProfileImagesMain" component={PreviewImagesProfile} />
      <MainStack.Screen name="PreviewProfileImagesMainRestrictedView" component={ViewRestrictedImagesOnly} />
      {/* END OF CUSTOM ADDED COMPONENT(S) */}
      <MainStack.Screen name="Profile1" component={Profile1} />
      <MainStack.Screen name="BacheloretteConfirmationAboutPage" component={BacheloretteConfirmationAboutPageComponent} />
      <MainStack.Screen name="BacheloretteMain" component={BacheloretteMainViewHomepage} />
      <MainStack.Screen name="IntroductoryVideoProfileMain" component={IntroductoryVideoMainHelper} />
      <MainStack.Screen name="MatchChatVideoCommunicationView" component={ViewIndividualStartLiveStreamChatBetweenUsers} />
      <MainStack.Screen name="TermsOfUse" component={TermsOfUserDisplay} />
      <MainStack.Screen name="PrivacyPolicy" component={PrivacyPolicyMain} />
      <MainStack.Screen name="PasswordResetConfirmation" component={PasswordConfirmationShow} />
      <MainStack.Screen name="ProfileFollowersViewAll" component={ViewAllFollowersProfileViewMore} />
      <MainStack.Screen name="ViewProfileViewsIndividualProfileOwn" component={ViewProfileViewIndividualProfilewViewsOwn} />
      <MainStack.Screen name="PayToRemoveProfileViewHistory" component={PayToRemoveProfileViewHistoryHelper} />
      <MainStack.Screen name="CreateNewBacheloretteGame" component={CreateNewBacheloretteListingGame} />
      <MainStack.Screen name="MainViewCompetitionBacheloretteGame" component={MainBachelorBacheloretteMenuNav} />
      <MainStack.Screen name="ViewManageActiveSessionsBacheloretteBachelor" component={ViewManageActiveSessionsBacheloretteBachelorHelper} />
      <MainStack.Screen name="IndividualGameCompetitionView" component={IndividualGameCompetitionView} />
      <MainStack.Screen name="ViewQuestionareResults" component={ViewQuestionareResultsSubmitted} />
      <MainStack.Screen name="QuestionareBachelorBachelorettePage" component={QuestionareBachelorBacheloretteComponent} />
      <MainStack.Screen name="VideoCallInstigateInAppGame" component={InAppGameVideoCallingHelper} />
      <MainStack.Screen name="InAppGameCompetitionSubmitTalentVideo" component={InAppGameCompetitionSubmitTalentVideoHelper} />
      {/* <MainStack.Screen name="Profile2" component={Profile2} />
      <MainStack.Screen name="Profile3" component={Profile3} />
      <MainStack.Screen name="Profile4" component={Profile4} />
      <MainStack.Screen name="Profile5" component={Profile5} />
      <MainStack.Screen name="Profile6" component={Profile6} />
      <MainStack.Screen name="Profile7" component={Profile7} />
      <MainStack.Screen name="Profile8" component={Profile8} /> */}
      <MainStack.Screen name="More" component={More} />
      <MainStack.Screen name="Tour" component={Tour} />
      <MainStack.Screen name="Car" component={Car} />
      <MainStack.Screen name="OverViewCar" component={OverViewCar} />
      <MainStack.Screen name="Hotel" component={Hotel} />
      <MainStack.Screen name="Review" component={Review} />
      <MainStack.Screen name="Feedback" component={Feedback} />
      <MainStack.Screen name="Messages" component={Messages} />
      <MainStack.Screen name="Notification" component={Notification} />
      <MainStack.Screen name="Walkthrough" component={Walkthrough} />
      <MainStack.Screen name="SignUp" component={SignUp} />
      <MainStack.Screen name="SignIn" component={SignIn} />
      <MainStack.Screen name="ResetPassword" component={ResetPassword} />
      <MainStack.Screen name="ChangePassword" component={ChangePassword} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <MainStack.Screen name="ProfileExample" component={ProfileExample} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <MainStack.Screen name="HotelInformation" component={HotelInformation} />
      <MainStack.Screen name="CheckOut" component={CheckOut} />
      <MainStack.Screen name="Currency" component={Currency} />
      <MainStack.Screen name="Coupons" component={Coupons} />
      <MainStack.Screen name="HotelDetail" component={HotelDetail} />
      <MainStack.Screen name="PreviewBooking" component={PreviewBooking} />
      <MainStack.Screen name="PricingTable" component={PricingTable} />
      <MainStack.Screen name="PricingTableIcon" component={PricingTableIcon} />
      <MainStack.Screen name="BookingDetail" component={BookingDetail} />
      <MainStack.Screen name="PostDetail" component={PostDetail} />
      <MainStack.Screen name="TourDetail" component={TourDetail} />
      <MainStack.Screen name="CarDetail" component={CarDetail} />
      <MainStack.Screen name="AboutUs" component={AboutUs} />
      <MainStack.Screen name="OurService" component={OurService} />
      <MainStack.Screen name="FlightSearch" component={FlightSearch} />
      <MainStack.Screen name="SelectFlight" component={SelectFlight} />
      <MainStack.Screen name="FlightResult" component={FlightResult} />
      <MainStack.Screen name="FlightSummary" component={FlightSummary} />
      <MainStack.Screen name="FlightTicket" component={FlightTicket} />
      <MainStack.Screen name="CruiseSearch" component={CruiseSearch} />
      {/* <MainStack.Screen name="Cruise" component={Cruise} /> */}
      <MainStack.Screen name="CruiseDetail" component={CruiseDetail} />
      {/* <MainStack.Screen name="BusSearch" component={BusSearch} /> */}
      <MainStack.Screen name="BusList" component={BusList} />
      <MainStack.Screen name="BusSelectSeat" component={BusSelectSeat} />
      <MainStack.Screen
        name="PreviewBusBooking"
        component={PreviewBusBooking}
      />
      <MainStack.Screen name="BusTicket" component={BusTicket} />
      <MainStack.Screen name="Event" component={Event} />
      <MainStack.Screen name="EventDetail" component={EventDetail} />
      <MainStack.Screen
        name="EventPreviewBooking"
        component={EventPreviewBooking}
      />
      <MainStack.Screen name="DashboardEvent" component={DashboardEvent} />
      <MainStack.Screen name="EventTicket" component={EventTicket} />
      <MainStack.Screen name="PaymentMethod" component={PaymentMethod} />
      <MainStack.Screen name="MyPaymentMethod" component={MyPaymentMethod} />
      <MainStack.Screen name="AddPayment" component={AddPayment} />
      <MainStack.Screen
        name="PaymentMethodDetail"
        component={PaymentMethodDetail}
      />
      <MainStack.Screen name="PreviewPayment" component={PreviewPayment} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="ThemeSetting" component={ThemeSetting} />
      <MainStack.Screen name="NotFound" component={NotFound} />
    </MainStack.Navigator>
  );
}
const mapStateToProps = (state) => {
  console.log("state", state);
	return {
    authenticatedData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null,
    sequence: _.has(state.guidedTour, "sequence") ? state.guidedTour.sequence : 0
	}
}
export default connect(mapStateToProps, { })(Main);

const BottomTabNavigator = (props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const font = useFont();
  const auth = useSelector(state => state.auth);
  const login = _.has(auth, "tempUserData") && Object.values(auth.tempUserData).length >= 8 ? true : false;
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarActiveTintColor: colors.accent,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: font,
          paddingBottom: 2,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: t('home'),
          tabBarIcon: ({color}) => {
            return <Image source={require("../assets/icons/dating-icons/Cupid.png")} style={{ 
              maxWidth: 27.25,
              maxHeight: 27.25,
              height: 27.25,
              width: 27.25 
            }} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Booking"
        component={Booking}
        options={{
          title: t(`Post(s)`),
          tabBarIcon: ({color}) => {
            return <Image source={require("../assets/icons/dating-icons/Photos.png")} style={{ 
              maxWidth: 27.25,
              maxHeight: 27.25,
              height: 27.25,
              width: 27.25 
            }} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Messenger"
        component={Messenger}
        options={{
          title: t('message'),
          tabBarIcon: ({color}) => {
            return <Image source={require("../assets/icons/dating-icons/Message.png")} style={{ 
              maxWidth: 27.25,
              maxHeight: 27.25,
              height: 27.25,
              width: 27.25 
            }} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Post"
        component={ViewNearbyUsersMapView}
        options={{
          title: t('Nearby Users'),
          tabBarIcon: ({color}) => {
            return <Image source={require("../assets/icons/dating-icons/Nearby.png")} style={{ 
              maxWidth: 27.25,
              maxHeight: 27.25,
              height: 27.25,
              width: 27.25 
            }} />;
          },
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={login ? Profile : Walkthrough}
        options={{
          title: t('account'),
          tabBarIcon: ({color}) => {
            return <Image source={require("../assets/icons/dating-icons/Settings.png")} style={{ 
              maxWidth: 27.25,
              maxHeight: 27.25,
              height: 27.25,
              width: 27.25 
            }} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
