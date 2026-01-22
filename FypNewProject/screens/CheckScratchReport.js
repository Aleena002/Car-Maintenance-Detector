import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Share,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ScratchReportScreen = ({ navigation }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Scratch Report:\nThe left front fender and door area have multiple surface-level scratches, likely caused by brushing against a rough object. Although not too deep, they may require polishing or minor paint touch-up.\nImage: https://i.imgur.com/ZfX6ZpB.jpg",
      });
    } catch (error) {
      alert("Error sharing report: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.headerText}>Scratch Report</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text>Honda Car </Text>
        {/* Scratch Images */}
        <View style={styles.gridContainer}>
          {[
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9VYZBo5TqUee7fqRIYPz9g2--q_XWFdGomA&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlCduDI_OPgaK9tMeybASXG7GGIEXs_4i5Ww&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJPnxhYmf61vpgfV-d9h1kDbzWdJ_nZY7wuA&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEE9Jct32i2aGhmoZQAywdHtdTtRUpvlv_zA&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6bfZwSRI7LucjQ1Plo4dqD_IrHAVkoNNeLg&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOcE3K17RvDTAM40U8Qh26lcE1n5Q-8WCr_A&s",
          ].map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.scratchImage} />
          ))}
        </View>

        {/* Report Description */}
        <Text style={styles.reportText}>
          The left front fender and door area have multiple surface-level scratches,
          likely caused by brushing against a rough object. Although not too deep, they
          may require polishing or minor paint touch-up.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShare}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { name: "home", label: "Home", screen: "Home" },
          { name: "camera", label: "Scan", screen: "Scan" },
          { name: "user", label: "Profile", screen: "Profile" },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.navButton}
            onPress={() => navigation.navigate(item.screen)}
          >
            <FontAwesome name={item.name} size={24} color="white" />
            <Text style={styles.navText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  scratchImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
  reportText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 15,
    padding: 10,
    color: "#333",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 20,
  },
  button: {
    backgroundColor: "navy",
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "navy",
    paddingVertical: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
});

export default ScratchReportScreen;
