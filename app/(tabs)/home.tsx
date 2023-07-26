import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const Home = () => {
  const [firstName, setFirstName] = useState('You');
  const [lastName, setLastName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [markerData, setMarkerData] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [region, setRegion] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude: lat, longitude: lng } = location.coords;
        setRegion({
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setMarkerData({ firstName, lastName });
      }
    })();
  }, []);

  const handleNextPress = () => {
    // Assuming you've already validated the input values
    const latitudeNum = parseFloat(latitude);
    const longitudeNum = parseFloat(longitude);

    if (!isNaN(latitudeNum) && !isNaN(longitudeNum)) {
      setMarkerData({ firstName, lastName });
      setModalVisible(false);
      setRegion({
        latitude: latitudeNum,
        longitude: longitudeNum,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleMapPress = ({ nativeEvent }: any) => {
    const { latitude: lat, longitude: lng } = nativeEvent.coordinate;
    setLatitude(lat.toString());
    setLongitude(lng.toString());
    setRegion({ ...region, latitude: lat, longitude: lng });
  };

  const handleModalDismiss = () => {
    setModalVisible(false);
  };

  const handleSearchButton = () => {
    firstName === 'You' && setFirstName('')
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {region && (
          <MapView style={styles.map} region={region} showsUserLocation={true} onPress={handleMapPress}>
            {markerData && (
              <Marker
                coordinate={{
                  latitude: parseFloat(latitude),
                  longitude: parseFloat(longitude),
                }}
                title={`${firstName} ${lastName}`}
                calloutOffset={{ x: -8, y: 28 }} // Offset the callout bubble position
              />
            )}
          </MapView>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchButton}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalDismiss}
      >
        <TouchableWithoutFeedback onPress={(handleModalDismiss)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Search Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#777"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#777"
                  value={lastName}
                  onChangeText={setLastName}
                />
                <View style={styles.coordinatesContainer}>
                  <TextInput
                    style={[styles.input, styles.coordinatesInput]}
                    placeholder="Latitude"
                    placeholderTextColor="#777"
                    keyboardType="numbers-and-punctuation"
                    value={latitude.toString()}
                    onChangeText={setLatitude}
                  />
                  <TextInput
                    style={[styles.input, styles.coordinatesInput]}
                    placeholder="Longitude"
                    placeholderTextColor="#777"
                    keyboardType="numbers-and-punctuation"
                    value={longitude.toString()}
                    onChangeText={setLongitude}
                  />
                </View>
                <TouchableOpacity style={styles.searchButtonModal} onPress={handleNextPress}>
                  <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  searchButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#0069D9',
    padding: 10,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    marginHorizontal: 40,
    padding: 20,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFF',
  },
  input: {
    height: 40,
    borderRadius: 5,
    borderColor: '#999',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#FFF',
    backgroundColor: '#333',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinatesInput: {
    flex: 1,
  },
  searchButtonModal: {
    backgroundColor: '#0069D9',
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;
