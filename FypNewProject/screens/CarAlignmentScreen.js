import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from 'react-native-image-zoom-viewer';


const ScanScreen = ({ navigation }) => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [annotatedVideo, setAnnotatedVideo] = useState(null);
  const [scanReport, setScanReport] = useState('');
  const [zoomVisible, setZoomVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [outputZoomVisible, setOutputZoomVisible] = useState(false);


  const SERVER_URL = 'http://192.168.137.1:5000';

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await AsyncStorage.getItem('user_session');
        if (session) {
          const parsed = JSON.parse(session);
          setUserEmail(parsed.userEmail || '');
          console.log('📧 User Email from session:', parsed.userEmail);
        } else {
          console.log('⚠️ No session found');
        }
      } catch (e) {
        console.error('Failed to load session', e);
      }
    };

    loadSession();
  }, []);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setImages(selectedUris);
      setVideos([]);
    }
  };

  const handleTakeImageFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setImages(selectedUris);
      setVideos([]);
    }
  };

  const handlePickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      Alert.alert('Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      const selectedUris = result.assets.map((asset) => asset.uri);
      setVideos(selectedUris);
      setImages([]);
    }
  };

const handleScan = async () => {
  if (images.length === 0 && videos.length === 0) {
    Alert.alert('No media selected');
    return;
  }

  setIsScanning(true);

  try {
    // ✅ IMAGE UPLOAD
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('image', {
        uri: images[0],
        name: images[0].split('/').pop(),
        type: 'image/jpeg', // or image/png if needed
      });

      const response = await fetch(`${SERVER_URL}/analyze_al`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      let imgUrl = result?.yolo_result?.annotated_image || result.output_url;
      if (imgUrl && !imgUrl.startsWith('http')) {
        imgUrl = `${SERVER_URL}${imgUrl}`;
      }

      setAnnotatedImage(imgUrl);
      console.log(imgUrl)
      setAnnotatedVideo(null);
      setScanReport('Image analyzed successfully.');
      Alert.alert('Image Scan Completed');

      if (userEmail) {
        const reportData = {
          email: userEmail,
          type: 'image',
          output_url: imgUrl,
          timestamp: new Date().toISOString(),
          
        };

        await fetch('https://carmaintainence-default-rtdb.firebaseio.com/report.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData),
        });
      }
    }

    // ✅ VIDEO UPLOAD
    if (videos.length > 0) {
      const formData = new FormData();
      formData.append('video', {
        uri: videos[0],
        name: videos[0].split('/').pop(),
        type: 'video/mp4',
      });

      const response = await fetch(`${SERVER_URL}/analyze-video_al`, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result.error) throw new Error(result.error);

      let vidUrl = result.output_video || result.output_url;
      if (vidUrl && !vidUrl.startsWith('http')) {
        vidUrl = `${SERVER_URL}${vidUrl}`;
      }

      setAnnotatedVideo(vidUrl);
      setAnnotatedImage(null);
      setScanReport('Video analyzed successfully.');
      Alert.alert('Video Scan Completed');

      if (userEmail) {
        const reportData = {
          email: userEmail,
          type: 'video',
          output_url: vidUrl,
          timestamp: new Date().toISOString(),
        };

        await fetch('https://carmaintainence-default-rtdb.firebaseio.com/report.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportData),
        });
      }
    }

  } catch (error) {
    console.error('Scan Error:', error);
    Alert.alert('Scan Failed', error.message || 'Unexpected error');
  } finally {
    setIsScanning(false);
  }
};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.carDetectText}>Car Detected</Text>
      </View>
      <View style={styles.header}>
        <Text style={styles.headerText}>Vehicle alignItems</Text>
      </View>

      {isScanning && (
        <View style={styles.statusBarContainer}>
          <View style={styles.statusBar} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.previewColumn}>
        <TouchableOpacity onPress={() => setZoomVisible(true)} style={styles.previewFrame}>
          {images.length > 0 ? (
            <Image source={{ uri: images[0] }} style={styles.frameMedia} />
          ) : videos.length > 0 ? (
            <Video source={{ uri: videos[0] }} useNativeControls resizeMode="cover" style={styles.frameMedia} />
          ) : (
            <View style={styles.emptyFrame}>
              <Image source={require('../assets/logo.png')} style={styles.logo} />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton} onPress={handleScan} disabled={isScanning}>
          <Text style={styles.scanButtonText}>{isScanning ? 'Scanning...' : 'Scan'}</Text>
        </TouchableOpacity>


          {annotatedImage && (
            <>
            <Image source={{ uri: annotatedImage }} style={styles.imageColumn} />
              <TouchableOpacity onPress={() => setOutputZoomVisible(true)}>
              <Text>Full Screen</Text>
              </TouchableOpacity>
            </>
          )}

        {annotatedVideo && <Video source={{ uri: annotatedVideo }} useNativeControls resizeMode="cover" style={styles.video} />}
        {scanReport !== '' && <View style={styles.reportBox}><Text style={styles.reportText}>{scanReport}</Text></View>}
      </ScrollView>

      <Modal visible={zoomVisible} transparent animationType="slide">
        <View style={styles.optionOverlay}>
          <View style={styles.optionBox}>
            <TouchableOpacity style={styles.optionBtn} onPress={() => { setZoomVisible(false); handleTakeImageFromCamera(); }}>
              <Text style={styles.optionText}>Take Image from Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn} onPress={() => { setZoomVisible(false); handlePickImage(); }}>
              <Text style={styles.optionText}>Upload Image from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn} onPress={() => { setZoomVisible(false); handlePickVideo(); }}>
              <Text style={styles.optionText}>Upload Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setZoomVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        {[
          { name: 'home', label: 'Home', screen: 'Home' },
          { name: 'camera', label: 'Scan', screen: 'Scan' },
          { name: 'user', label: 'Profile', screen: 'Profile' },
        ].map((item, index) => (
          <TouchableOpacity key={index} style={styles.navButton} onPress={() => navigation.navigate(item.screen)}>
            <FontAwesome name={item.name} size={24} color="white" />
            <Text style={styles.navText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal visible={outputZoomVisible} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <TouchableOpacity
            onPress={() => setOutputZoomVisible(false)}
            style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }}
          >
            <Text style={{ color: 'white', fontSize: 24 }}>✕</Text>
          </TouchableOpacity>

          <ImageViewer
            imageUrls={[{ url: annotatedImage }]}
            enableSwipeDown
            onSwipeDown={() => setOutputZoomVisible(false)}
            backgroundColor="black"
          />
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 0 },
  headerText: { marginLeft: '25%', fontSize: 22, fontWeight: 'bold', color: 'navy', marginBottom: 10 },
  previewColumn: { alignItems: 'center', paddingBottom: 120 },
  previewFrame: {
    width: '100%', height: 220, borderRadius: 15,
    backgroundColor: '#eee', marginBottom: 15, justifyContent: 'center',
    alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#ccc',
  },
  frameMedia: { width: '100%', height: '100%', borderRadius: 15 },
  emptyFrame: { justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  imageColumn: { width: '100%', height: 200, borderRadius: 15, marginBottom: 15, marginTop: 15 },
  video: { width: '100%', height: 200, borderRadius: 15, marginBottom: 15 },
  scanButton: {
    backgroundColor: 'navy', paddingVertical: 14, borderRadius: 15,
    width: '90%', alignItems: 'center', elevation: 3,
  },
  scanButtonText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  reportBox: { backgroundColor: '#eef5ff', borderRadius: 12, padding: 12, marginTop: 20, width: '90%' },
  reportText: { color: '#333', fontSize: 14, lineHeight: 20 },
  optionOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  optionBox: { backgroundColor: '#fff', padding: 20, borderRadius: 15, width: '80%', alignItems: 'center', gap: 10 },
  optionBtn: {
    backgroundColor: 'navy', padding: 12, borderRadius: 10,
    width: '100%', alignItems: 'center',
  },
  optionText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: { marginTop: 10, padding: 10 },
  cancelText: { fontSize: 14, color: 'red' },
  statusBarContainer: {
    height: 5,
    width: '100%',
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
    marginBottom: 10,
  },
  statusBar: {
    height: '100%',
    width: '100%',
    backgroundColor: 'blue',
  },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'navy',
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: 14, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10,
  },
  navButton: { alignItems: 'center' },
  navText: { color: 'white', fontSize: 12, marginTop: 5 },
  logo: { width: 80, height: 80 },
  carDetectText: { marginLeft: 10, fontSize: 16, fontWeight: 'bold' },
});

export default ScanScreen;
