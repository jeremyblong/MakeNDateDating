import {StyleSheet} from 'react-native';
import {BaseColor} from '@config';

export default StyleSheet.create({
  inputItem: {
    flex: 6.5,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 46,
    backgroundColor: BaseColor.fieldColor,
    borderRadius: 5,
    padding: 10,
  },
  tokenValue: {
    fontSize: 21.25,
    fontWeight: "bold"
  },
  warningTxt: {
    fontSize: 16.25,
    marginTop: 27.25
  },
  hr: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: 2,
    marginTop: 12.25,
    marginBottom: 12.25,
    width: "100%"
  },
  label: {
    fontWeight: "400", 
    color: "#000",
    fontSize: 16.25,
    marginBottom: 12.25,
    marginTop: 17.25
  },
  cardIcon: {
    minWidth: 50,
    width: 50,
    height: 50,
    minHeight: 50,
    maxHeight: 50,
    maxWidth: 50
  },  
  checkDefault: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 15,
    marginTop: 10,
  },
  card: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 1.5,
  },
});
