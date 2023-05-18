import React, {useRef, useState} from 'react';
import { View, ScrollView, Dimensions, Platform } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import Modal from 'react-native-modal';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  HelpBlock,
  Button
} from '@components';
import { useTranslation } from 'react-i18next';
import styles from './individualListingStyles.js';
import { UserData } from '@data';
import _ from "lodash";
import RBSheet from "react-native-raw-bottom-sheet";
import InvoiceViewPaneHelper from "./panes/invoice/invoiceUser.js";
import OpenSupportTicketReportClothingArticleInnapropriate from "./panes/reporting/reportClothingArticle.js";

const { width, height } = Dimensions.get("window");

const IndividualClothingCommerceView = ({ navigation, route }) => {

  const { data } = route.params;

  console.log("data", data);

  const {colors, theme} = useTheme();
  const {t} = useTranslation();
  const colorSchemeDark = theme.dark;
  const rbsheetPurchase = useRef(null);
  const sheetReporting = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userData] = useState(UserData[0]);

  const [ state, setState ] = useState({
    user: null,
    stats: null
  })

  // Show bottom modal when user press for booking
  const openModalBottom = () => {
    setModalVisible(true);
  };

  // Render container bottom
  const renderModalBottom = () => {
    return (
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[styles.contentFilterBottom, {backgroundColor: colors.card}]}>
          <View style={styles.contentSwipeDown}>
            <View style={styles.lineSwipeDown} />
          </View>
          <View style={styles.contentModel}>
            <View style={{alignItems: 'flex-start'}}>
              <Text title3>{data.NAME}</Text>
              <Text subhead grayColor>
                {data.DIMENSION}
              </Text>
              <Text title3 primaryColor semibold style={{marginTop: 5}}>
                {`$${data.PRICE}`}
              </Text>
              
            </View>
            <Button
              style={{ right: 17.25, position: "absolute", bottom: 25 }}
              onPress={() => {
                setModalVisible(false);

                setTimeout(() => {
                  rbsheetPurchase.current.open();
                }, 500)
              }}>
              {"Purchase NOW!"}
            </Button>
          </View>
        </View>
      </Modal>
    );
  };

  // const calculateLength = (len) => {
  //   switch (len) {
  //     case 1:
  //       return require("../../../assets/icons/1.png");
  //       break;
  //     case 2:
  //         return require("../../../assets/icons/2.png");
  //         break;
  //     case 3:
  //       return require("../../../assets/icons/3.png");
  //       break;
  //     case 4:
  //       return require("../../../assets/icons/4.png");
  //       break;
  //     case 5:
  //       return require("../../../assets/icons/5.png");
  //       break;
  //     case 6:
  //       return require("../../../assets/icons/6.png");
  //       break;
  //     case 7:
  //       return require("../../../assets/icons/7.png");
  //       break;
  //     default:
  //       break;
  //   }
  // }

  console.log("userData.performance", userData.performance); // rbsheetPurchase.current.open();

  return (
    <View style={{flex: 1}}>
        <RBSheet 
          ref={sheetReporting}
          height={height}
          openDuration={250}
          closeOnDragDown={false}
          customStyles={{
              draggableIcon: {
                  minWidth: width * 0.625
              }
          }}
        >
          <View style={{ flex: 1 }}>
            <OpenSupportTicketReportClothingArticleInnapropriate sheetReporting={sheetReporting} data={data} />
          </View>
        </RBSheet>
        <RBSheet
            ref={rbsheetPurchase}
            height={height}
            openDuration={250}
            closeOnDragDown={false}
            customStyles={{
                draggableIcon: {
                    minWidth: width * 0.625
                }
            }}
        >
          <View style={Platform.OS === "ios" ? { flex: 1, top: 67.5 } : { flex: 1 }}>
            <Header
              title={"Payment For Item(s)"}
              subTitle="+ Shipping & Delivery..."
              renderLeft={() => {
              return (
                  <Icon
                    name="arrow-left"
                    size={20}
                    color={colors.primary}
                    enableRTL={true}
                  />
              );
              }}
              onPressLeft={() => {
                rbsheetPurchase.current.close();
              }}
            />
            <InvoiceViewPaneHelper rbsheetPurchase={rbsheetPurchase} data={data} />
          </View>
        </RBSheet>
        <Header
            title={"Purchase Flowers!"}
            subTitle="Send a gift or kind gesture..."
            renderLeft={() => {
              return (
                  <Icon
                    name="arrow-left"
                    size={20}
                    color={colors.primary}
                    enableRTL={true}
                  />
              );
            }}
            onPressLeft={() => {
              navigation.goBack();
            }}
            renderRight={() => {
              return (
                  <Text headline primaryColor numberOfLines={1}>
                    Purchase
                  </Text>
              );
            }}
            onPressRight={() => {
              openModalBottom();
            }}
        />
        <SafeAreaView
            style={BaseStyle.safeAreaView}
            edges={['right', 'left', 'bottom']}>
            {renderModalBottom()}
            <ScrollView>
              <View style={styles.wrapper}>
                <Image resizeMode={"contain"} style={styles.blockImage} source={{ uri: data.LARGE }} />
              </View>
                <View
                  style={{
                  paddingHorizontal: 20,
                  marginTop: 20,
                  alignItems: 'flex-start',
                }}>
                  <Text headline accentColor semibold>
                    {"Title"}
                  </Text>
                  <Text body1 style={{marginTop: 5}}>
                    {data.NAME}
                  </Text>
                  <Text style={{ marginTop: 15 }} headline accentColor semibold>
                    {t('information')}
                  </Text>
                  <Text body2 style={{marginTop: 5}}>
                    {data.DESCRIPTION}
                  </Text> 
                  <Text style={{ marginTop: 15 }} headline accentColor semibold>
                    {t('Dimensions')}
                  </Text>
                  <Text body2 style={{marginTop: 5}}>
                    {data.DIMENSION}
                  </Text> 
                  <Text style={{ marginTop: 15 }} headline accentColor semibold>
                    {t('Reference Code')}
                  </Text>
                  <Text body2 style={{marginTop: 5}}>
                    {data.CODE}
                  </Text> 
                  <Button style={{ backgroundColor: BaseColor.greenColor, maxHeight: 50, marginTop: 22.25, marginBottom: 10 }} full onPress={() => openModalBottom()}> 
                      {"Purchase FLOWERS!"}
                  </Button>
                  {/* <Text headline accentColor semibold>
                    {"Hashtags"}
                  </Text>
                  <View style={styles.rowWrapped}>
                    <FlatList
                      data={data.hashtags}
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
                      keyExtractor={(item, index) => item.id}
                      renderItem={renderTag}
                    />
                  </View> */}
                  {/* <Text headline semibold style={{marginTop: 20}}>
                  {"Features"}
                  </Text> */}
                  {/* <View style={styles.listContentService}>
                    <View
                        style={{
                          alignItems: 'center',
                          flex: 1
                        }}
                      >
                        <View style={styles.iconedBackground}>
                          <Image source={calculateLength(data.lengthOfWear)} style={colorSchemeDark ? [styles.iconed, { tintColor: "#fff" }] : [styles.iconed]} />
                        </View>
                        <Text
                          overline
                          numberOfLines={1}
                          accentColor
                          style={colorSchemeDark ? { marginTop: 5, color: "#fff" } : { marginTop: 5, color: "#000" }}
                        >
                        {data.lengthOfWear} days worn
                        </Text>
                    </View>
                    <View
                        style={{
                          alignItems: 'center',
                          flex: 1
                        }}
                      >
                        <View style={styles.iconedBackground}>
                          <Image source={require("../../../assets/icons/pricetag.png")} style={colorSchemeDark ? [styles.iconed, { tintColor: "#fff" }] : [styles.iconed]} />
                        </View>
                        <Text
                          overline
                          numberOfLines={1}
                          accentColor
                          style={colorSchemeDark ? { marginTop: 5, color: "#fff" } : { marginTop: 5, color: "#000" }}
                        >
                        {`Price: ${Number(data.price).toFixed(2)}`}
                        </Text>
                    </View>
                    <View
                        style={{
                          alignItems: 'center',
                          flex: 1
                        }}
                      >
                        <View style={styles.iconedBackground}>
                          <Image source={require("../../../assets/icons/clothing.png")} style={colorSchemeDark ? [styles.iconed, { tintColor: "#fff" }] : [styles.iconed]} />
                        </View>
                        <Text
                          overline
                          numberOfLines={1}
                          accentColor
                          style={colorSchemeDark ? { marginTop: 5, color: "#fff", textAlign: "center" } : { marginTop: 5, color: "#000", textAlign: "center" }}
                        >
                        {calculateClothingType(data.clothingType)}
                        </Text>
                    </View>
                    <View
                        style={{
                          alignItems: 'center',
                          flex: 1
                        }}
                      >
                        <View style={styles.iconedBackground}>
                          <Image source={require("../../../assets/icons/date.png")} style={colorSchemeDark ? [styles.iconed, { tintColor: "#fff" }] : [styles.iconed]} />
                        </View>
                        <Text
                          overline
                          numberOfLines={1}
                          accentColor
                          style={colorSchemeDark ? { marginTop: 5, color: "#fff" } : { marginTop: 5, color: "#000" }}
                        >
                        {`Posted ${moment(data.date).fromNow(true)}`}
                        </Text>
                    </View>
                    <View
                        style={{
                          alignItems: 'center',
                          flex: 1
                        }}
                      >
                        <View style={styles.iconedBackground}>
                          <Image source={calculateLength(data.files.length)} style={colorSchemeDark ? [styles.iconed, { tintColor: "#fff" }] : [styles.iconed]} />
                        </View>
                        <Text
                          overline
                          numberOfLines={2}
                          accentColor
                          style={colorSchemeDark ? { marginTop: 5, color: "#fff" } : { marginTop: 5, color: "#000" }}
                        >
                        {data.files.length} file(s)
                        </Text>
                    </View>
                  <Icon
                      name={'angle-right'}
                      color={BaseColor.grayColor}
                      size={16}
                      solid
                      enableRTL={true}
                  />
                  </View> */}
              </View>
              {/* <View style={[styles.line, {backgroundColor: colors.border}]} />
              <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                  {state.stats !== null ? <ProfilePerformance type="medium" data={state.stats} /> : null}
              </View> */}
              {/* <View style={styles.contentContact}>
                <Tag primary onPress={() => navigation.navigate('Profile1', { user: state.user })}>
                  {t('view_profile')}
                </Tag>
              </View> */}
                <View style={[styles.line, {backgroundColor: colors.border}]} />
                <View style={{paddingHorizontal: 20, marginTop: 10}}>
                    <HelpBlock
                      title={"Need to report innapropriate content?"}
                      description={"We appreciate reporting of innappropriate content - these clothing articles are obviously used with visible wear but if something obviously out of the ordinary is seen - please report with the form after clicking below..."}
                      phone={"Click to report item"}
                      email={"support@makendate.com"}
                      style={{margin: 10, marginBottom: 32.5 }}
                      onPress={() => {
                        sheetReporting.current.open()
                      }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    </View>
  );
}
export default IndividualClothingCommerceView;
