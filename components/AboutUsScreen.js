import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';
export default function AboutUsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Welcome!</Text>
      <Text style={styles.paragraph}>
        At ALPHA, we believe in empowering every individual to achieve their personal fitness goals with personalized guidance and a supportive community. Our platform is designed to bring together top trainers, nutritionists, and health enthusiasts in one space to help you stay motivated, track progress, and unlock your full potential.
      </Text>
      <Divider bold={true} />
      <Text style={styles.subHeading}>Our Mission</Text>
      <Text style={styles.paragraph}>
        Our mission is to simplify your fitness journey by offering tailored diet plans, effective workout routines, and ongoing support. We aim to provide everyone access to expert insights, whether you're a beginner or a seasoned fitness enthusiast.
      </Text>
      <Divider bold={true} />
      <Text style={styles.subHeading}>Our Vision</Text>
      <Text style={styles.paragraph}>
        We envision a world where health and fitness are accessible to everyone, regardless of where they are in their journey. By connecting users with trainers and offering tools to track progress, we strive to foster a healthier, happier community.
      </Text>
      <Divider bold={true} />
      <Text style={styles.subHeading}>Why Choose Us?</Text>
      <Text style={styles.bulletPoint}>• Expert Guidance: Our trainers and dietitians provide customized plans and professional advice.</Text>
      <Text style={styles.bulletPoint}>• Community Support: Share milestones, get inspired, and motivate others within our fitness community.</Text>
      <Text style={styles.bulletPoint}>• Personalized Experience: Tailored programs and flexible plans to fit your lifestyle.</Text>

      <Text style={styles.endparagraph}>
        Thank you for choosing ALPHA! We're excited to be a part of your journey to better health and fitness. Together, let’s make progress happen!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light background for a softer look
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontFamily: 'CustomFont-Bold',
    color: '#1f1f7a', // Darker accent color
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 22,
    fontFamily: 'CustomFont-Bold',
    color: '#1f1f7a',
    marginVertical: 12,
  },
  paragraph: {
    fontSize: 16,
    color: '#4a4a4a', // Subtle, readable text color
    marginBottom: 12,
    lineHeight: 24,
    fontFamily: 'CustomFont',
  },
  endparagraph: {
      fontSize: 16,
      color: '#4a4a4a', // Subtle, readable text color
      marginBottom: 30,
      marginTop: 10,
      lineHeight: 24,
      fontFamily: 'CustomFont',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#4a4a4a',
    marginBottom: 6,
    paddingLeft: 16,
    fontFamily: 'CustomFont',
  },
});
