import React, { Fragment, useState } from "react";
import { View, TouchableOpacity, useColorScheme } from "react-native";
import { Button, Text, Icon } from "@components";
import styles from "./pageStyles.js";
import { useTheme, BaseColor } from '@config';

const PageEightDataRegisterClinician = ({ handleContinuation, businessAccountTempData, saveAuthenticationDetailsCounselor }) => {
    const { colors, theme } = useTheme();
    const colorSchemeDark = theme.dark;

    const [ state, setState ] = useState({
        years: 0,
        expertises: {
            reflectiveListening: null,
            emotionFocussed: null,
            narrativeTherapy: null,
            solutionFocussed: null,
            theGottmanMethod: null,
            imagoRelationshipTherapy: null
        },
        specificRequests: []
    });

    const calculateDisabled = () => {
        
        const {
            reflectiveListening,
            emotionFocussed,
            narrativeTherapy,
            solutionFocussed,
            theGottmanMethod,
            imagoRelationshipTherapy
        } = state.expertises;

        const { years } = state;

        if ((imagoRelationshipTherapy !== null) && (theGottmanMethod !== null) && (solutionFocussed !== null) && (narrativeTherapy !== null) && (emotionFocussed !== null) && (reflectiveListening !== null) && (years !== 0)) {
            return false;
        } else {
            return true;
        }
    }
    console.log("state.expertises", state.expertises);

    const handleSubmission = () => {
        console.log("handleSubmission clicked/ran...");

        const { years, expertises, specificRequests } = state;

        saveAuthenticationDetailsCounselor({
            ...businessAccountTempData,
            methodExpertises: expertises,
            yearsOfExperience: years,
            specificRequests
        });

        setTimeout(() => {
            handleContinuation(9)
        },  775);
    }
    console.log("specificRequests", state.specificRequests);
    return (
        <Fragment>
            <View style={{ margin: 12.25 }}>
                <View style={colorSchemeDark ? { backgroundColor: "#000", minWidth: "100%", width: "100%", borderRadius: 8.25 } : { backgroundColor: "#fff", minWidth: "100%", width: "100%", borderRadius: 8.25 }}>
                    <View style={{ marginBottom: 12.25 }} />
                        <View style={[styles.itemPrice, { borderColor: colors.border, paddingHorizontal: 12.25 }]}>
                            <Text headline semibold>
                                Years of experience
                            </Text>
                            <Text body2 grayColor style={{ marginVertical: 5 }}>
                                How many years have you been providing professional therapy services?
                            </Text>
                            <View style={styles.linePrice}>
                                <Text title3 primaryColor semibold>
                                    {state.years} year(s)
                                </Text>
                                <View style={styles.iconRight}>
                                <TouchableOpacity onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        years: prevState.years !== 0 ? prevState.years - 1 : prevState.years
                                    }
                                })}>
                                    <Icon
                                        name="minus-circle"
                                        size={24}
                                        color={BaseColor.grayColor}
                                    />
                                </TouchableOpacity>
                                <Text title1 style={{ paddingHorizontal: 10 }}>
                                    {state.years}
                                </Text>
                                <TouchableOpacity onPress={() => setState(prevState => {
                                    return {
                                        ...prevState,
                                        years: prevState.years + 1
                                    }
                                })}>
                                    <Icon name="plus-circle" size={24} color={colors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 13.25, marginTop: 13.25 }} />
                <View style={colorSchemeDark ? { backgroundColor: "#000", minWidth: "100%", width: "100%", borderRadius: 8.25 } : { backgroundColor: "#fff", minWidth: "100%", width: "100%", borderRadius: 8.25 }}>
                    <View style={{ marginBottom: 12.25 }}>
                        <View style={[styles.itemPrice, { borderColor: colors.border, paddingHorizontal: 12.25 }]}>
                            <Text headline semibold>
                                Add your expertises
                            </Text>
                            <Text body2 grayColor style={{ marginVertical: 5 }}>
                                Add areas of expertise that you'd like to focus on...
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.fourtyPercent}>
                                <Text style={styles.innerText}>Reflective listening</Text>
                            </View>
                            <View style={styles.sixtyPercent}>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                reflectiveListening: "least"
                                            }
                                        }
                                    })} style={state.expertises.reflectiveListening === "least" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>LEAST</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                reflectiveListening: "some"
                                            }
                                        }
                                    })} style={state.expertises.reflectiveListening === "some" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>SOME</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                reflectiveListening: "most"
                                            }
                                        }
                                    })} style={state.expertises.reflectiveListening === "most" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>MOST</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.fourtyPercent}>
                                <Text style={styles.innerText}>Emotion focused therapy</Text>
                            </View>
                            <View style={styles.sixtyPercent}>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                emotionFocussed: "least"
                                            }
                                        }
                                    })} style={state.expertises.emotionFocussed === "least" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>LEAST</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                emotionFocussed: "some"
                                            }
                                        }
                                    })} style={state.expertises.emotionFocussed === "some" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>SOME</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                emotionFocussed: "most"
                                            }
                                        }
                                    })} style={state.expertises.emotionFocussed === "most" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>MOST</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.fourtyPercent}>
                                <Text style={styles.innerText}>Narrative therapy</Text>
                            </View>
                            <View style={styles.sixtyPercent}>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                narrativeTherapy: "least"
                                            }
                                        }
                                    })} style={state.expertises.narrativeTherapy === "least" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>LEAST</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                narrativeTherapy: "some"
                                            }
                                        }
                                    })} style={state.expertises.narrativeTherapy === "some" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>SOME</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                narrativeTherapy: "most"
                                            }
                                        }
                                    })} style={state.expertises.narrativeTherapy === "most" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>MOST</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.fourtyPercent}>
                                <Text style={styles.innerText}>Solution-focused therapy</Text>
                            </View>
                            <View style={styles.sixtyPercent}>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                solutionFocussed: "least"
                                            }
                                        }
                                    })} style={state.expertises.solutionFocussed === "least" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>LEAST</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                solutionFocussed: "some"
                                            }
                                        }
                                    })} style={state.expertises.solutionFocussed === "some" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>SOME</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                solutionFocussed: "most"
                                            }
                                        }
                                    })} style={state.expertises.solutionFocussed === "most" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>MOST</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.fourtyPercent}>
                                <Text style={styles.innerText}>Gottman method</Text>
                            </View>
                            <View style={styles.sixtyPercent}>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                theGottmanMethod: "least"
                                            }
                                        }
                                    })} style={state.expertises.theGottmanMethod === "least" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>LEAST</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                theGottmanMethod: "some"
                                            }
                                        }
                                    })} style={state.expertises.theGottmanMethod === "some" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>SOME</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                theGottmanMethod: "most"
                                            }
                                        }
                                    })} style={state.expertises.theGottmanMethod === "most" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>MOST</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.fourtyPercent}>
                                <Text style={styles.innerText}>Imago relationship therapy (IRT)</Text>
                            </View>
                            <View style={styles.sixtyPercent}>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                imagoRelationshipTherapy: "least"
                                            }
                                        }
                                    })} style={state.expertises.imagoRelationshipTherapy === "least" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>LEAST</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                imagoRelationshipTherapy: "some"
                                            }
                                        }
                                    })} style={state.expertises.imagoRelationshipTherapy === "some" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>SOME</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setState(prevState => {
                                        return {
                                            ...prevState,
                                            expertises: {
                                                ...prevState.expertises,
                                                imagoRelationshipTherapy: "most"
                                            }
                                        }
                                    })} style={state.expertises.imagoRelationshipTherapy === "most" ? styles.selectedOneThird : styles.oneThird}>
                                        <Text style={styles.innerText}>MOST</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 13.25, marginTop: 13.25 }} />
                <View style={colorSchemeDark ? { backgroundColor: "#000", minWidth: "100%", width: "100%", borderRadius: 8.25 } : { backgroundColor: "#fff", minWidth: "100%", width: "100%", borderRadius: 8.25 }}>
                    <View style={{ marginBottom: 12.25 }} />
                    <View style={[styles.itemPrice, { borderColor: colors.border, paddingHorizontal: 12.25 }]}>
                        <Text headline semibold>
                            Client specific requests (requests by mentored/counseled peers)
                        </Text>
                        <Text body2 grayColor style={{ marginVertical: 5 }}>
                            The following client-requested matches would be a good fit for me...
                        </Text>
                    </View>
                    <View style={{ margin: 12.25 }}>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            const indexed = prevState.specificRequests.indexOf("christian-based");
                            return {
                                ...prevState,
                                specificRequests: !prevState.specificRequests.includes("christian-based") ? [...prevState.specificRequests, "christian-based"] : prevState.specificRequests.filter((item) => item !== "christian-based")
                            }
                        })} style={state.specificRequests.includes("christian-based") ? styles.fullWidthTouchableActive : styles.fullWidthTouchable}>
                            <Text style={styles.touchableCustomTxt}>
                                Christian-Based Therapy
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            const indexed = prevState.specificRequests.indexOf("LGBTQ+-specific");
                            return {
                                ...prevState,
                                specificRequests: !prevState.specificRequests.includes("LGBTQ+-specific") ? [...prevState.specificRequests, "LGBTQ+-specific"] : prevState.specificRequests.filter((item) => item !== "LGBTQ+-specific")
                            }
                        })} style={state.specificRequests.includes("LGBTQ+-specific") ? styles.fullWidthTouchableActive : styles.fullWidthTouchable}>
                            <Text style={styles.touchableCustomTxt}>
                                An LGBTQ+ therapist
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            const indexed = prevState.specificRequests.indexOf("older");
                            return {
                                ...prevState,
                                specificRequests: !prevState.specificRequests.includes("older") ? [...prevState.specificRequests, "older"] : prevState.specificRequests.filter((item) => item !== "older")
                            }
                        })} style={state.specificRequests.includes("older") ? styles.fullWidthTouchableActive : styles.fullWidthTouchable}>
                            <Text style={styles.touchableCustomTxt}>
                                An older therapist (45+)
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            const indexed = prevState.specificRequests.indexOf("non-religious");
                            return {
                                ...prevState,
                                specificRequests: !prevState.specificRequests.includes("non-religious") ? [...prevState.specificRequests, "non-religious"] : prevState.specificRequests.filter((item) => item !== "non-religious")
                            }
                        })} style={state.specificRequests.includes("non-religious") ? styles.fullWidthTouchableActive : styles.fullWidthTouchable}>
                            <Text style={styles.touchableCustomTxt}>
                                A non-religious therapist
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            const indexed = prevState.specificRequests.indexOf("conservative-leaning");
                            return {
                                ...prevState,
                                specificRequests: !prevState.specificRequests.includes("conservative-leaning") ? [...prevState.specificRequests, "conservative-leaning"] : prevState.specificRequests.filter((item) => item !== "conservative-leaning")
                            }
                        })} style={state.specificRequests.includes("conservative-leaning") ? styles.fullWidthTouchableActive : styles.fullWidthTouchable}>
                            <Text style={styles.touchableCustomTxt}>
                                A convervative therapist
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            const indexed = prevState.specificRequests.indexOf("liberal-leaning");
                            return {
                                ...prevState,
                                specificRequests: !prevState.specificRequests.includes("liberal-leaning") ? [...prevState.specificRequests, "liberal-leaning"] : prevState.specificRequests.filter((item) => item !== "liberal-leaning")
                            }
                        })} style={state.specificRequests.includes("liberal-leaning") ? styles.fullWidthTouchableActive : styles.fullWidthTouchable}>
                            <Text style={styles.touchableCustomTxt}>
                                A liberal therapist
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            const indexed = prevState.specificRequests.indexOf("therapist-of-color");
                            return {
                                ...prevState,
                                specificRequests: !prevState.specificRequests.includes("therapist-of-color") ? [...prevState.specificRequests, "therapist-of-color"] : prevState.specificRequests.filter((item) => item !== "therapist-of-color")
                            }
                        })} style={state.specificRequests.includes("therapist-of-color") ? styles.fullWidthTouchableActive : styles.fullWidthTouchable}>
                            <Text style={styles.touchableCustomTxt}>
                                A therapist of color
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setState(prevState => {
                            const indexed = prevState.specificRequests.indexOf("african-american-black");
                            return {
                                ...prevState,
                                specificRequests: !prevState.specificRequests.includes("african-american-black") ? [...prevState.specificRequests, "african-american-black"] : prevState.specificRequests.filter((item) => item !== "african-american-black")
                            }
                        })} style={state.specificRequests.includes("african-american-black") ? styles.fullWidthTouchableActive : styles.fullWidthTouchable}>
                            <Text style={styles.touchableCustomTxt}>
                                An african american therapist
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ marginTop: 13.25, marginTop: 13.25 }} />
                <Button
                    full
                    disabled={calculateDisabled()}
                    style={calculateDisabled() ? { marginBottom: 20, backgroundColor: "lightgrey" } : { marginBottom: 20, backgroundColor: colors.accent }}
                    onPress={() => handleSubmission()}>
                    {"Submit & Continue"}
                </Button>
            </View>
        </Fragment>
    );
}
export default PageEightDataRegisterClinician;