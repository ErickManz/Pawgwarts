import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase-config';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useNavigation} from '@react-navigation/native'
import TrainingScreen from './SingleTrainingScreen';
import navigationTheme from '../navigation/navigationTheme';


function TrainingCategoriesScreen(props) {
  console.log("+++ props passed into TrainingCategoriesScreen +++", props)
  const [trainingsList, setTrainingsList] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("")
  const [singleTraining, setSingleTraining] = useState({})
  const navigation = useNavigation();

  // Turns title into camelCase
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return "";
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

  const getTrainingsList = async (year, trainingCategory) => {
    const trainingCollectionRef = collection(db, year, trainingCategory, 'trainings');
    const trainingDocsRef = await getDocs(trainingCollectionRef);
    const trainings = trainingDocsRef.docs.map((doc) => ({ ...doc.data() }));
    console.log("// [getTrainingsList] - trainings list: ", trainings);
    setCurrentCategory(trainingCategory)
    setTrainingsList(trainings);
  }

  const getSingleTraining = async (year, trainingCategory, trainingTitle) => {
    const trainingDocRef = doc(db, year, trainingCategory, 'trainings', trainingTitle);
    const docSnap = await getDoc(trainingDocRef);
    const trainingData = docSnap.data();
    console.log("// [getSingleTraining] - single training data:", trainingData);
    setSingleTraining(trainingData);
    // <TrainingScreen trainingDetails={singleTraining} />
  }


  return (
    <View style={styles.container}>
      <Button onPress={()=> navigation.pop()} title="back"/>
      {trainingsList.length === 0 ? <View style={styles.options}>
        {props.categories.map(category => (<TouchableOpacity key={category.title} style={styles.optionButton} onPress={() => getTrainingsList(props.year, camelize(category.title))}>
          <Text style={styles.option}> {category.title} </Text>
        </TouchableOpacity>))}
      </View> : trainingsList.length > 0 && Object.keys(singleTraining).length === 0 ? (<View style={styles.options}>
        {trainingsList.map(training => (<TouchableOpacity key={training.title} style={styles.optionButton} onPress={() => getSingleTraining(props.year, currentCategory, camelize(training.title))}>
          <Text style={styles.option}> {training.title} </Text>
        </TouchableOpacity>))}
      </View>) : <TrainingScreen trainingDetails={singleTraining} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 10,
    height: '100%',
  },
  top: {
    marginVertical: 16,
  },
  options: {
    marginVertical: 16,
    flex: 1,
  },
  bottom: {
    marginBottom: 12,
    paddingVertical: 16,
    flexDirection: 'column',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  question: {
    fontSize: 28,
  },
  option: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  optionButton: {
    paddingVertical: 12,
    marginVertical: 6,
    backgroundColor: '#34A0A4',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  parent: {
    height: '100%',
  },
});
export default TrainingCategoriesScreen;
