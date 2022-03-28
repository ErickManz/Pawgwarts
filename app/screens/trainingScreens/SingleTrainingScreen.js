import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/firebase-config';
import { getDocs, collection, doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Image, ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function SingleTrainingScreen({ navigation, route }) {
  const { year, trainingCategory, trainingTitle } = route.params;
  const [trainingDetails, setTrainingDetails] = useState({});


  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [trainingInProgress, setTrainingInProgress] = useState(false);
  const [startTraining, setStartTraining] = useState(false);

  // Dummy Training Data:
  const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
  const steps = ["Lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt"]
  const tips = ["Don't give up", "You got this!"]
  const tools = ["Lorem", "ipsum", "dolor"];

  const getSingleTraining = async (year, trainingCategory, trainingTitle) => {
    const trainingDocRef = doc(db, year, trainingCategory, 'trainings', trainingTitle);
    const docSnap = await getDoc(trainingDocRef);
    const trainingData = docSnap.data();
    console.log("// [getSingleTraining] - single training data:", trainingData);
    setTrainingDetails(trainingData);
    // <TrainingScreen trainingDetails={singleTraining} />
  }

  const getUserDetails = async () => {
    console.log("+++ getUserDetails just ran +++")
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const docRef = doc(db, 'users', userId);
    const userDoc = await getDoc(docRef);
    const userDetails = userDoc.data()

    const usersCompletedTrainings = userDetails.completedTrainings;
    const usersTrainingsInProgress = userDetails.trainingsInProgress;

    if (usersCompletedTrainings.includes(trainingDetails.title)) {
      console.log("!!! This Training Exists in the users' completed Training array !!!");
      setTrainingCompleted(true);
    } else if ((usersTrainingsInProgress.includes(trainingDetails.title))) {
      console.log("!!! this training doesn't exist in the users' trainingInProgress array !!!");
      setTrainingInProgress(true)
    } else {
      setStartTraining(true)
    }
  }

  const setTraining = () => {
    getSingleTraining(year, trainingCategory, trainingTitle);
    getUserDetails()

  }
  useEffect(() => { setTraining() }, []);

  // runs when clicked Start Training Button
  const handleStartTraining = async () => {
    setStartTraining(false)
    setTrainingInProgress(true);

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, { trainingsInProgress: arrayUnion(trainingDetails.title) });
    navigation.reset({index: 0,route:[{name:"home"}]});
  };

  // runs when clicked Mark Completed Button
  const handleMarkCompleted = async () => {
    setStartTraining(false);
    setTrainingCompleted(true);

    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, { completedTrainings: arrayUnion(trainingDetails.title) });
    await updateDoc(docRef, { trainingsInProgress: arrayRemove(trainingDetails.title) });

  }


  return (
    Object.keys(trainingDetails).length === 0 ? <Text> ... Loading </Text> :
      <SafeAreaView style={styles.container}>

        <View style={styles.top}>
          <Text style={styles.trainingTitle}> {trainingDetails.title} </Text>
          <Text> Dificulty: {trainingDetails.difficulty}/5 </Text>
        </View>

        <ScrollView>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={require('../../assets/DogLogo.png')} />
          </View>

          <View style={styles.trainingDescriptionContainer}>
            {trainingDetails.description ? <Text style={styles.bodyText}>{trainingDetails.description}</Text> : <Text style={styles.bodyText}>{loremIpsum}</Text>}
          </View>

          <Text style={styles.stepsTitle}>Steps</Text>
          {trainingDetails.steps[0] !== "" ? trainingDetails.steps.map(step => (<Text key={steps.indexOf(step)} style={bodyText}>Step {steps.indexOf(step) + 1}: {step}</Text>)) : steps.map(step => (<Text key={steps.indexOf(step)} style={styles.bodyText}>Step {steps.indexOf(step) + 1}: {step}</Text>))}

          <Text style={styles.stepsTitle}>Tips</Text>
          {trainingDetails.tips[0] !== "" ? trainingDetails.tips.map(tip => (<Text key={tips.indexOf(tip)} style={bodyText}>* {tip}</Text>)) : tips.map(tip => (<Text key={tips.indexOf(tip)} style={styles.bodyText}>* {tip}</Text>))}

          <Text style={styles.stepsTitle}> Recommended Training Tools </Text>
          {trainingDetails.tools[0] !== "" ? trainingDetails.tools.map(tool => (<Text key={tools.indexOf(tool)} style={bodyText}>* {tool}</Text>)) : tools.map(tool => (<Text key={tools.indexOf(tool)} style={styles.bodyText}>* {tool}</Text>))}
        </ScrollView>

        <View style={styles.bottom}>
          {startTraining ? <Button title='StartTraining' onPress={() => handleStartTraining()} /> : trainingCompleted ? <Text> You already completed this training </Text> : <Button title='In Progress: Mark Completed' onPress={handleMarkCompleted} />}
        </View>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  trainingTitle: {
    fontSize: 20,
    fontWeight: "bold"
  },
  stepsTitle: {
    textAlign: 'center',
    paddingTop: 5,
    fontWeight: 'bold',
    fontSize: 18,
  },
  logo: {
    width: 90,
    height: 150,
  },
  logoContainer: {
    alignItems: 'center',
  },
  trainingDescriptionContainer: {
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'wheat'
  },
  bodyText: {
    fontSize: 18,
  },
  bottom: {
    flexDirection: "column",
    alignItems: 'center'
  },
});


export default SingleTrainingScreen;